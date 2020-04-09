import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SongList, Song } from 'src/app/services/data-types/common-types';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageBaseService, NzMessageService } from 'ng-zorro-antd';
import { findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit,OnDestroy {
  songListInfo:SongList;
  description = {
    short:'',
    long:''
  }
  controlDesc={
    isExpand:false,
    label:'Show More',
    iconCls:'down'
  }
  private appStore$:Observable<AppStoreModule>;
  private destory$ = new Subject<void>();
  currentSong:Song;
  currentIndex:number;
  constructor(
    private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServe:SongService,
    private batchActionServe:BatchActionsService,
    private nzMessageServe:NzMessageService
    ) { 
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res =>{
      this.songListInfo = res;
      if(res.description){
        this.changeDesc(res.description);
      }
      this.listenCurrent();
    });
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
        this.currentIndex = findIndex(this.songListInfo.tracks,song);
      }
      else{
        this.currentIndex = -1;
      }
    })
  }

  private changeDesc(desc:string){
    if(desc.length<99){
      this.description={
        short:'<b>Description: </b>'+this.replaceBr(desc),
        long:''
      };
    }else{
      const str = '<b>Description: </b>'+this.replaceBr(desc);
      this.description={
        short:str.slice(0,99)+'...',
        long:str
      };
    }
  }

  private replaceBr(str:string):string{
    return str.replace(/\n/g,'<br/>');
  }

  toggleDesc(){
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if(this.controlDesc.isExpand){
      this.controlDesc.label = 'Retract';
      this.controlDesc.iconCls = "up";
    }else{
      this.controlDesc.label = 'Show More';
      this.controlDesc.iconCls = "down";
    }
  }
  
  onAddSong(song:Song,isPlay = false){
    if(!this.currentSong || this.currentSong.id != song.id){
      this.songServe.getSongList(song).subscribe(list=>{
        if(list.length){
          this.batchActionServe.insertSong(list[0],isPlay);
        }else{
          this.nzMessageServe.create('warning',"Can't find url");
        }
        
      });
    }
  }

  onAddSongs(songs:Song[],isPlay = false){
    this.songServe.getSongList(songs).subscribe(list=>{
      if(list.length){
        if(isPlay){
          this.batchActionServe.selectPlayList({list,index:0});
        }
        else{
          this.batchActionServe.insertSongs(list);
        }
        
      }
    })
  }
}
