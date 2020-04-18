import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { Song } from 'src/app/services/data-types/common-types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetPlayMode, SetSongList, SetCurrentIndex,SetCurrentAction } from '../actions/player.action';
import { SetModalVisiable, SetModalType, SetUserId, SetLikeId, SetShareInfo } from '../actions/member.action';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  default = 'default'
}

export type ShareInfo={
  id:string;
  type:string;
  txt:string;
}

export type MemberState = {
  modalVisiable: boolean;
  modalType: ModalTypes;
  userId: string;
  likeId:string;
  shareInfo?:ShareInfo;
}



export const initialState:MemberState = {
  modalVisiable:false,
  modalType: ModalTypes.default,
  userId: '',
  likeId:'',

}

const reducer = createReducer(
    initialState,
    on(SetModalVisiable,(state,{modalVisiable})=>({...state,modalVisiable})),
    on(SetModalType,(state,{modalType})=>({...state,modalType})),
    on(SetUserId,(state,{userId})=>({...state,userId})),
    on(SetLikeId,(state,{likeId})=>({...state,likeId})),
    on(SetShareInfo,(state,{shareInfo})=>({...state,shareInfo})),
    );

export function memberReducer(state:MemberState, action:Action) {
  return reducer(state, action);
}
