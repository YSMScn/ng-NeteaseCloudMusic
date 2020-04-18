import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SongList, Song, Singer } from 'src/app/services/data-types/common-types';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageBaseService, NzMessageService } from 'ng-zorro-antd';
import { findIndex } from 'src/app/utils/array';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { MemberService } from 'src/app/services/member.service';
import { SetShareInfo } from 'src/app/store/actions/member.action';

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
  //@Output()onLikeSong=new EventEmitter<string>();
  constructor(
    private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServe:SongService,
    private batchActionServe:BatchActionsService,
    private nzMessageServe:NzMessageService,
    private memberServe:MemberService
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
          this.alertMessage('warning',"Can't find url");
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

  onLikeSong(id:string){
    this.batchActionServe.likeSong(id);
  }

  onLikeSheet(id:string){
    this.memberServe.likeSheet(id,1).subscribe(code=>{
      this.alertMessage('success',"It's in your Like List now");
    },error=>{
      this.alertMessage('error',error.msg||"Fail")
    })
  }

  private alertMessage(type:string,msg:string){
    this.nzMessageServe.create(type,msg);
  }

  shareResouce(resource:Song|SongList,type='song'){
    let txt = '';
    if(type === 'playlist'){
      txt = this.makeTxt('Song list',resource.name,(<SongList>resource).creator.nickname);
    }else{
      txt = this.makeTxt('Song',resource.name,(<Song>resource).ar);
    }
    this.store$.dispatch(SetShareInfo({shareInfo:{id:resource.id.toString(),type,txt}}))
    console.log(txt);
  }

  private makeTxt(type:string,name:string,makeBy:string|Singer[]):string{
    let makeByStr = '';
    if(Array.isArray(makeBy)){
      makeByStr = makeBy.map(item => item.name).join('/');
    }
    else{
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
