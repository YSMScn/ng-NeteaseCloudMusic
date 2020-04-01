import { PlayState } from "../reducers/player.reducer";
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppStoreModule } from '..';

const selectPlayerStates = (state:PlayState) => state;
export const getPlayer = createFeatureSelector<AppStoreModule>('player');
export const getPlaying = createSelector(selectPlayerStates,(state:PlayState)=>state.playing);
export const getPlayList = createSelector(selectPlayerStates,(state:PlayState)=>state.playList);
export const getPlayMode = createSelector(selectPlayerStates,(state:PlayState)=>state.playMode);
export const getSongList = createSelector(selectPlayerStates,(state:PlayState)=>state.songList);
export const getCurrentIndex = createSelector(selectPlayerStates,(state:PlayState)=>state.currentIndex);

export const getCurrentSong = createSelector(selectPlayerStates,({playList,currentIndex}:PlayState)=>playList[currentIndex]);