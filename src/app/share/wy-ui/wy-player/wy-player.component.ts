import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common-types';
import { collapseMotion } from 'ng-zorro-antd';
import { PlayMode } from './player-types';
import { SetPlayList } from 'src/app/store/actions/player.action';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 35;
  bufferOffset1 = 55;
  songList:Song[];
  playList:Song[];
  currentIndex:number;
  currentMode:PlayMode;
  currentSong:Song;
  constructor(
    private store$:Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer)); 
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
    // appStore$.pipe(select(getCurrentAction)).subscribe(action => this.watchCurrentAction(action));

    const stateArr = [{
      type:getSongList,
      cb: list=>this.watchList(list,'songList')
    },
    {
      type:getPlayList,
      cb: list=>this.watchList(list,'playList')
    },
    {
      type:getCurrentIndex,
      cb: index=>this.watchCurrentIndex(index)
    }];

    // stateArr.forEach(item=>{
    //   appStore$.pipe(select(item.type)).subscribe(item.cb);
    // })
  }

  ngOnInit(): void {
  }

  private watchList(list: Song[],type:string){
    console.log('list: ',type,list); 
    this[type]=list;
    //First time see this way! this[]
  }
  private watchCurrentIndex(index: number){
    console.log('index: ',index);
    this.currentIndex = index; 
  }

  private watchPlayMode(mode: PlayMode) {
     this.currentMode = mode;
    // if (this.songList) {
    //   let list = this.songList.slice();
    //   if (mode.type === 'random') {
    //     list = shuffle(this.songList);
    //   }
    //   this.updateCurrentIndex(list, this.currentSong);
    //   this.store$.dispatch(SetPlayList({ playList: list }));
    // }
    // for later on
    console.log('currentMode: ',this.currentMode);
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    // this.bufferPercent = 0;
    // if (song) {
    //   this.duration = song.dt / 1000;
    // }
    //for later on
    console.log('currentSong: ',this.currentSong);
  }

}
