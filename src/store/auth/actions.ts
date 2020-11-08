/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Dispatch } from 'redux';
import { pipe } from 'fp-ts/es6/pipeable';
import { fromEither } from 'fp-ts/es6/Option';
import authSlice from './slice';
import { getAuthUser } from '../../services/AuthService';

export const loadAuthUser = () => async (dispatch: Dispatch) => {
    const authUserOption = pipe(
        await getAuthUser(),
        fromEither
    );
    dispatch(authSlice.actions.setUserData(authUserOption));
};
