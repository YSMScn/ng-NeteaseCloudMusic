import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, recordVal } from 'src/app/services/data-types/member-types';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data-types/common-types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { findIndex } from 'src/app/utils/array';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs';
import { RecordType, MemberService } from 'src/app/services/member.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SongService } from 'src/app/services/song.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styles: ['.record-detail .page-wrap{padding:40px}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit,OnDestroy {
  user:User;
  userRecord:recordVal[];
  private currentSong:Song;
  currentIndex = -1;
  private destory$ = new Subject();
  recordType=RecordType.weekData;
  constructor(
    private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private batchActionServe:BatchActionsService,
    private memberServe:MemberService,
    private songServe:SongService,
    private nzMessageServe:NzMessageService,
    private cdr:ChangeDetectorRef
  ) {
    this.route.data.pipe(map(res =>res.user)).subscribe(([user,userRecord]) => {
      this.user = user;
      this.userRecord = userRecord;
      console.log('user: ',user);
      console.log('userRecord: ',userRecord);
      this.listenCurrent();
    })
   }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  ngOnInit(): void {
  }

  private listenCurrent(){
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destory$)).subscribe(song=>{
      this.currentSong = song;
      if(song){
        const songs = this.userRecord.map(item => item.song);
        this.currentIndex = findIndex(songs,song);
      }
      else{
        this.currentIndex = -1;
      }
      this.cdr.markForCheck();
    })
  }

  onChangeType(type:RecordType){
    console.log('CurrentType: ',this.recordType);
    console.log('type: ',type);
    if(this.recordType !== type){
      this.recordType = type;
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type).subscribe(res =>{
        this.userRecord = res;
        this.cdr.markForCheck();
      })
    }
  }

  onAddSong([song,play]){
    if(!this.currentSong || this.currentSong.id != song.id){
      this.songServe.getSongList(song).subscribe(list=>{
        if(list.length){
          this.batchActionServe.insertSong(list[0],play);
        }else{
          this.nzMessageServe.create('Warning',"Can't find url");
        }
      })

    }
  }
}
