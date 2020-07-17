import { getAuthUser } from '../../services/AuthService';
import authSlice from './slice';
import { Dispatch } from 'redux';

export const loadAuthUser = () => async (dispatch: Dispatch) => {
    const authUserOption = await getAuthUser();
    dispatch(authSlice.actions.setUserData(authUserOption));
};
