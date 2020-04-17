import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { User, recordVal, UserSongList } from 'src/app/services/data-types/member-types';
import { SongListService } from 'src/app/services/song-list.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { RecordType, MemberService } from 'src/app/services/member.service';
import { SongService } from 'src/app/services/song.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Song } from 'src/app/services/data-types/common-types';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { findIndex } from 'src/app/utils/array';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-centre',
  templateUrl: './centre.component.html',
  styleUrls: ['center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentreComponent implements OnInit, OnDestroy {
  user:User;
  userRecord:recordVal[];
  userSongList:UserSongList;
  recordType=RecordType.weekData;
  private currentSong:Song;
  currentIndex = -1;
  private destory$ = new Subject();
  constructor(
    private route:ActivatedRoute,
    private songListServe:SongListService,
    private batchActionServe:BatchActionsService,
    private memberServe:MemberService,
    private songServe:SongService,
    private nzMessageServe:NzMessageService,
    private store$:Store<AppStoreModule>,
    private cdr:ChangeDetectorRef
    ) {
    this.route.data.pipe(map(res =>res.user)).subscribe(([user,userRecord,userSongList]) => {
      this.user = user;
      this.userRecord = userRecord.slice(0,10);
      this.userSongList = userSongList;
      console.log('user: ',user);
      console.log('userRecord: ',userRecord);
      console.log('userSongList: ',userSongList);
      this.listenCurrent();
    })
   }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  ngOnInit(): void {
  }

  onPlayList(id:number){
    this.songListServe.playList(id).subscribe(list=>{
      this.batchActionServe.selectPlayList({list,index:0});
      this.cdr.markForCheck();
    })
  }

  onChangeType(type:RecordType){
    if(this.recordType !== type){
      this.recordType = type;
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type).subscribe(res =>{
        this.userRecord = res.slice(0,10);
        this.cdr.markForCheck();
      })
    }
  }

  onAddSong([song,play]){
    console.log(this.userRecord);
    console.log(song);
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
}
