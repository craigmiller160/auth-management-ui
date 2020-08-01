import { getAuthUser } from '../../services/AuthService';
import authSlice from './slice';
import { Dispatch } from 'redux';
import { pipe } from 'fp-ts/es6/pipeable';
import { fromEither } from 'fp-ts/es6/Option';

export const loadAuthUser = () => async (dispatch: Dispatch) => {
    const authUserOption = pipe(
        await getAuthUser(),
        fromEither
    );
    dispatch(authSlice.actions.setUserData(authUserOption));
};
