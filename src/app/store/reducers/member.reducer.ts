import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { Song } from 'src/app/services/data-types/common-types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetPlayMode, SetSongList, SetCurrentIndex,SetCurrentAction } from '../actions/player.action';
import { SetModalVisiable, SetModalType } from '../actions/member.action';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  default = 'default'
}

export type MemberState = {
  modalVisiable: boolean;
  modalType: ModalTypes;
}



export const initialState:MemberState = {
  modalVisiable:false,
  modalType: ModalTypes.default
}

const reducer = createReducer(
    initialState,
    on(SetModalVisiable,(state,{modalVisiable})=>({...state,modalVisiable})),
    on(SetModalType,(state,{modalType})=>({...state,modalType})),
    );

export function memberReducer(state:MemberState, action:Action) {
  return reducer(state, action);
}