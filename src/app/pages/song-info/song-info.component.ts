import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Lyric, Song, Singer } from 'src/app/services/data-types/common-types';
import { BaseLyricLine, WYLyric } from 'src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs';
import { findIndex } from 'src/app/utils/array';
import { SetShareInfo } from 'src/app/store/actions/member.action';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['song-info.component.less']
})
export class SongInfoComponent implements OnInit {
  controlLyric = {
    isExpand:false,
    label:"Show All",
    iconCls:"down"
  }
  song:Song;
  lyric:BaseLyricLine[];
  currentSong:Song;
  private destory$ = new Subject<void>();
  constructor(private route:ActivatedRoute,
    private songServe:SongService,
    private batchActionServe:BatchActionsService,
    private nzMessageServe:NzMessageService,
    private store$:Store<AppStoreModule>,
    ) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song,lyric]) =>{
      this.song = song;
      this.lyric = new WYLyric(lyric).lines;
      this.listenCurrent();

    })
   }

  ngOnInit(): void {
  }

  private listenCurrent(){
    this.store$.pipe(select(getPlayer),select(getCurrentSong),takeUntil(this.destory$)).subscribe(song=>this.currentSong = song)
  }

  onToggleExpand(){
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if(this.controlLyric.isExpand){
      this.controlLyric.label = 'Retract';
      this.controlLyric.iconCls = "up";
    }else{
      this.controlLyric.label = 'Show More';
      this.controlLyric.iconCls = "down";
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

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  onLike(){
    this.batchActionServe.likeSong(this.song.id.toString());
  }

  onShare(){
    const txt = this.makeTxt('Song',this.song.name,this.song.ar);
    const type = 'song'
    this.store$.dispatch(SetShareInfo({shareInfo:{id:this.song.id.toString(),type,txt}}))
    console.log(txt);
  }

  private makeTxt(type:string,name:string,makeBy:Singer[]):string{
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
