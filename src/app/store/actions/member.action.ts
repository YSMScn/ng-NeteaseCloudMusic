import { createAction, props } from '@ngrx/store';
import { ModalTypes } from '../reducers/member.reducer';

export const SetModalVisiable = createAction('[member] Set modalVisiable',props<{modalVisiable:boolean}>()) ;
export const SetModalType = createAction('[member] Set modalType',props<{modalType:ModalTypes}>()) ;
