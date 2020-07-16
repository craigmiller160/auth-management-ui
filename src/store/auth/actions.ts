import { isSome } from 'fp-ts/es6/Option';
import { getAuthUser } from '../../services/AuthService';
import authSlice from './slice';
import { Dispatch } from 'redux';

export const loadAuthUser = () => async (dispatch: Dispatch) => { // TODO figure out more typings for Dispatch
    const authUserOption = await getAuthUser();
    dispatch(authSlice.actions.setUserData(authUserOption));
};
