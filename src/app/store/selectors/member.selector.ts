import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MemberState } from '../reducers/member.reducer';

const selectMemberStates = (state:MemberState) => state;
export const getMember = createFeatureSelector<MemberState>('member');
export const getModalVisiable = createSelector(selectMemberStates,(state:MemberState)=>state.modalVisiable);
export const getModalType = createSelector(selectMemberStates,(state:MemberState)=>state.modalType);
export const getUserId = createSelector(selectMemberStates,(state:MemberState)=>state.userId);
