import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song } from 'src/app/services/data-types/common-types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit,OnChanges {
  @Input()songList:Song[];
  @Input()currentSong:Song;
  // currentIndex = 0;
  currentIndex:number;
  @Input()show:boolean;
  @Output()onClose = new EventEmitter<void>();
  @Output()onChangeSong = new EventEmitter<Song>();
  @ViewChildren(WyScrollComponent)private wyScroll:QueryList<WyScrollComponent>;
  scrollY = 0;
  constructor(@Inject(WINDOW)private win:Window) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['songList']){
      console.log('songList',this.songList);
      this.currentIndex = 0;
      // this.currentIndex = findIndex(this.songList,this.currentSong);
    }
    if(changes['currentSong']){
      if(this.currentSong){
        this.currentIndex = findIndex(this.songList,this.currentSong);
        if(this.show){
          this.scrollToCurrent();
        }
      }else{

      }
      
    }
    if(changes['show']){
      if(!changes['show'].firstChange&&this.show){
        this.wyScroll.first.refreshScroll();
        // timer(80).subscribe(()=>{
        //   if(this.currentSong){
        //     this.scrollToCurrent(0);
        //   }
        // });
        this.win.setTimeout(()=>{
          if(this.currentSong){
            this.scrollToCurrent(0);
          }
        },80)
        this.wyScroll.last.refreshScroll();
      }
      console.log('currentSong',this.currentSong);
    }
  }

  private scrollToCurrent(speed=300){
    const songListRef = this.wyScroll.first.el.nativeElement.querySelectorAll("ul li");
    if(songListRef.length){
      const currentLi = <HTMLElement>songListRef[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      // console.log("this.scrollY: ",this.scrollY);
      // console.log("offsetTop: ",offsetTop);
      if((offsetTop - Math.abs(this.scrollY)) > offsetHeight * 5|| (offsetTop < Math.abs(this.scrollY))){
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }

    }
  }

  ngOnInit(): void {
  }

}
