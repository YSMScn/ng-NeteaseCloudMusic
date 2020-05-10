import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Song } from '../services/data-types/common-types';
import { Store, select } from '@ngrx/store';
import { getPlayer } from './selectors/player.selector';
import { PlayState, CurrentActions } from './reducers/player.reducer';
import { SetSongList, SetPlayList, SetCurrentIndex, SetCurrentAction } from './actions/player.action';
import { shuffle, findIndex } from '../utils/array';
import { getMember } from './selectors/member.selector';
import { MemberState, ModalTypes } from './reducers/member.reducer';
import { SetModalType, SetModalVisiable, SetLikeId } from './actions/member.action';
import { timer } from 'rxjs';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  private playerState: PlayState;
  private memberState: MemberState;
  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
    this.store$.pipe(select(getMember)).subscribe(res => this.memberState = res);
  }

  selectPlayList({list, index}: {list: Song[], index: number}) {
    this.store$.dispatch(SetSongList({songList: list}));
    let trueIndex = index;
    let trueList = list.slice();
    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(list || []);
      trueIndex = findIndex(trueList, list[trueIndex]);
    }
    this.store$.dispatch(SetPlayList({playList: trueList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex: trueIndex}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Play}));
  }

  deleteSong(song: Song) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;
    const songIndex = findIndex(songList, song);
    songList.splice(songIndex, 1);
    const playIndex = findIndex(playList, song);
    playList.splice(playIndex, 1);
    if (currentIndex > playIndex || currentIndex === playList.length) {
      currentIndex--;
    }
    this.store$.dispatch(SetSongList({songList}));
    this.store$.dispatch(SetPlayList({playList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Delete}));
  }
  clearSong() {
    this.store$.dispatch(SetSongList({songList: []}));
    this.store$.dispatch(SetPlayList({playList: []}));
    this.store$.dispatch(SetCurrentIndex({currentIndex: -1}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Clear}));
  }

  insertSong(song: Song, isPlay: boolean) {
    const songList = this.playerState.songList.slice();
    let playList = this.playerState.playList.slice();
    let insertIndex = this.playerState.currentIndex;
    const playListIndex = findIndex(songList, song);
    if (playListIndex > -1) {
      if (isPlay) {
        insertIndex = playListIndex;
      }
    } else {
      songList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      if (this.playerState.playMode.type === 'random') {
        playList = shuffle(songList);
      } else {
        playList.push(song);
      }
      this.store$.dispatch(SetSongList({songList}));
      this.store$.dispatch(SetPlayList({playList}));
    }
    if (insertIndex !== this.playerState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({currentIndex: insertIndex}));
      this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Play}));
    } else {
      this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Add}));
    }
  }
  // Insert a song list
  insertSongs(songs: Song[]) {
    let songList = this.playerState.songList.slice();
    let playList = this.playerState.playList.slice();
    const validSongs = songs.filter(item => findIndex(playList, item) === -1);
    if (validSongs.length) {
      songList = songList.concat(validSongs);
      let songPlayList = validSongs.slice();
      if (this.playerState.playMode.type === 'random') {
        songPlayList = shuffle(songList);
      }
      playList = playList.concat(songPlayList);
      this.store$.dispatch(SetSongList({songList}));
      this.store$.dispatch(SetPlayList({playList}));
    }
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Add}));

  }

  // login and show new panel
  controlModal(visiable = true, type?: ModalTypes) {
    this.store$.dispatch(SetModalVisiable({modalVisiable: visiable}));
    if (type) {
      this.store$.dispatch(SetModalType({modalType: type}));
    }
    if (!visiable) {
      timer(500).subscribe(() => {
        this.store$.dispatch(SetModalType({modalType: ModalTypes.default}));
      });

    }
  }

  // like Songs
  likeSong(id: string) {
      this.store$.dispatch(SetModalType({modalType: ModalTypes.Like}));
      this.store$.dispatch(SetLikeId({likeId: id}));
  }
}
