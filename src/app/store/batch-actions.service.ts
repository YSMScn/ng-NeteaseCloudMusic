import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Song } from '../services/data-types/common-types';
import { Store, select } from '@ngrx/store';
import { getPlayer } from './selectors/player.selector';
import { PlayState } from './reducers/player.reducer';
import { SetSongList, SetPlayList, SetCurrentIndex } from './actions/player.action';
import { shuffle, findIndex } from '../utils/array';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  private playerState:PlayState;
  constructor(private store$:Store<AppStoreModule>) { 
    this.store$.pipe(select(getPlayer)).subscribe(res=>this.playerState = res)
  }

  selectPlayList({list,index}:{list:Song[],index:number}){
    this.store$.dispatch(SetSongList({songList:list}));
    let trueIndex = index;
    let trueList = list.slice();
    if(this.playerState.playMode.type==='random'){
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList,list[trueIndex]);
    }
    this.store$.dispatch(SetPlayList({playList:trueList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex:trueIndex}));
  }

  deleteSong(song:Song){
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;
    const songIndex = findIndex(songList,song);
    songList.splice(songIndex,1)
    const playIndex = findIndex(playList,song);
    playList.splice(playIndex,1)
    if(currentIndex > playIndex || currentIndex == playList.length){
      currentIndex--;
    }
    this.store$.dispatch(SetSongList({songList:songList}));
    this.store$.dispatch(SetPlayList({playList:playList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex:currentIndex}));
  }
  clearSong(){
    this.store$.dispatch(SetSongList({songList:null}));
    this.store$.dispatch(SetPlayList({playList:null}));
    this.store$.dispatch(SetCurrentIndex({currentIndex:-1}));    
  }

  insertSong(song:Song,isPlay:boolean){
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let insertIndex = this.playerState.currentIndex;
    const playListIndex = findIndex(songList,song);
    if(playListIndex>-1){
      if(isPlay){
        insertIndex = playListIndex;
      }
    }else{
      songList.push(song);
      playList.push(song);
      if(isPlay){
        insertIndex = songList.length -1;
      }
      this.store$.dispatch(SetSongList({songList:songList}));
      this.store$.dispatch(SetPlayList({playList:playList}));
    }
    if(insertIndex!==this.playerState.currentIndex){
      this.store$.dispatch(SetCurrentIndex({currentIndex:insertIndex})); 
    }
  }
  //Insert a song list
  insertSongs(songs:Song[]){
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    songs.forEach(item=>{
      const playListIndex = findIndex(playList,item);
      if(playListIndex === -1){
        songList.push(item);
        playList.push(item);
      }
    });
    this.store$.dispatch(SetSongList({songList:songList}));
    this.store$.dispatch(SetPlayList({playList:playList}));
  }

}
