import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song, SongList } from 'src/app/services/data-types/common-types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song.service';
import { WYLyric, BaseLyricLine } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit,OnChanges {
  @Input()songList:Song[];
  @Input()currentSong:Song;
  @Input()playing:boolean;
  // currentIndex = 0;
  currentIndex:number;
  @Input()show:boolean;
  @Output()onClose = new EventEmitter<void>();
  @Output()onChangeSong = new EventEmitter<Song>();
  @Output()onDeleteSong = new EventEmitter<Song>();
  @Output()onClearSong = new EventEmitter<void>();
  @Output()onToInfo = new EventEmitter<[string,number]>();
  @Output()onLikeSong = new EventEmitter<string>();
  @Output()onShareSong = new EventEmitter<Song>();
  @ViewChildren(WyScrollComponent)private wyScroll:QueryList<WyScrollComponent>;
  scrollY = 0;
  currentLyric:BaseLyricLine[];
  private lyric:WYLyric;
  currentLineNum:number;
  lyricRefs:NodeList;
  private startLine:number = 2;
  constructor(@Inject(WINDOW)private win:Window, private songServe:SongService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['playing']){
      if(!changes['playing'].firstChange){
        if(this.lyric){
          this.lyric.togglgPlay(this.playing);
        }

      }
    }
    if(changes['songList']){
      //console.log('songList',this.songList);
      if(this.currentSong){
        this.updateCurrentIndex();
      }

      // this.currentIndex = findIndex(this.songList,this.currentSong);
    }
    if(changes['currentSong']){
      if(this.currentSong){
        this.updateCurrentIndex();
        this.updateLyric();
        if(this.show){
          this.scrollToCurrent();
        }
      }else{
        this.resetLyric();
      }

    }
    if(changes['show']){
      if(!changes['show'].firstChange&&this.show){
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        // timer(80).subscribe(()=>{
        //   if(this.currentSong){
        //     this.scrollToCurrent(0);
        //   }
        // });
        this.win.setTimeout(()=>{
          if(this.currentSong){
            this.scrollToCurrent(0);
          }
          if(this.lyricRefs){
            this.scrollToCurrentLyric(0);
          }
        },80)
      }
      //console.log('currentSong',this.currentSong);
    }
  }

  private updateCurrentIndex(){
    this.currentIndex = findIndex(this.songList,this.currentSong);
  }
  private updateLyric(){
    this.resetLyric();
    this.songServe.getLyric(this.currentSong.id).subscribe(res=>{
      this.lyric = new WYLyric(res);
      this.currentLyric = this.lyric.lines;
      this.startLine = res.tlyric?0:3;
      this.handleLyric();
      this.wyScroll.last.scrollTo(0,0);
      if(this.playing){
        this.lyric.play();
        console.log('updateLyric');
      }
    });
  }

  private resetLyric(){
    if(this.lyric){
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = null;
      this.currentLineNum=0;
      this.lyricRefs = null;
    }
  }

  seekLyric(time:number){
    if(this.lyric){
      this.lyric.seek(time);
    }
  }

  private handleLyric(){
    this.lyric.handler.subscribe(({lineNum})=>{
      //console.log('lineNum: ',lineNum);
      if(!this.lyricRefs){
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if(this.lyricRefs.length){
        this.currentLineNum = lineNum;
        if(lineNum>this.startLine){
          this.scrollToCurrentLyric(300);
        }
        else{
          this.wyScroll.last.scrollTo(0,0);
        }
      }

    })
  }

  private scrollToCurrent(speed=300){
    const songListRef = this.wyScroll.first.el.nativeElement.querySelectorAll("ul li");
    if(songListRef.length){
      const currentLi = <HTMLElement>songListRef[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      if((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5|| (offsetTop < Math.abs(this.scrollY))){
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }

    }
  }

  private scrollToCurrentLyric(speed=300){
    const targetLine = this.lyricRefs[this.currentLineNum - this.startLine];
    if(targetLine){
      this.wyScroll.last.scrollToElement(targetLine,speed,false,false);
    }
  }


  ngOnInit(): void {
  }

  toInfo(evt:MouseEvent,path:[string,number]){
    evt.stopPropagation();
    this.onToInfo.emit(path);
  }

  likeSong(evt:MouseEvent,id:string){
    evt.stopPropagation();
    this.onLikeSong.emit(id);

  }

  shareSong(evt:MouseEvent,song:Song){
    evt.stopPropagation();
    this.onShareSong.emit(song);
  }
}
