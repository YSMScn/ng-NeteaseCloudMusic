import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { Song } from 'src/app/services/data-types/common-types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetPlayMode, SetSongList, SetCurrentIndex } from '../actions/player.action';


export type PlayState = {
    //play or not
    playing:boolean;
    //mode: loop,random,singleLoop
    playMode:PlayMode;
    //SongList
    songList:Song[];
    //PlayList
    playList:Song[];
    //Current playing index
    currentIndex:number;

}


export const initialState:PlayState = {
    playing:false,
    songList:[],
    playList:[],
    playMode:{type:'loop',label:'Loop'},
    currentIndex: -1

}

const reducer = createReducer(
    initialState,
    on(SetPlaying,(state,{playing})=>({...state,playing})),
    on(SetPlayList,(state,{playList})=>({...state,playList})),
    on(SetPlayMode,(state,{playMode})=>({...state,playMode})),
    on(SetSongList,(state,{songList})=>({...state,songList})),
    on(SetCurrentIndex,(state,{currentIndex})=>({...state,currentIndex}))
    );

export function playerReducer(state:PlayState, action:Action) {
  return reducer(state, action);
}