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
import * as O from 'fp-ts/es6/Option';
import * as TE from 'fp-ts/es6/TaskEither';
import * as E from 'fp-ts/es6/Either';
import authSlice from './slice';
import { getAuthUser } from '../../services/AuthService';
import { AuthUser } from '../../types/auth';

export const loadAuthUser = () => (
  dispatch: Dispatch
): Promise<E.Either<Error, AuthUser>> =>
  pipe(
    getAuthUser(),
    TE.map((authUser: AuthUser) => {
      dispatch(authSlice.actions.setUserData(O.some(authUser)));
      return authUser;
    }),
    TE.mapLeft((ex: Error) => {
      dispatch(authSlice.actions.setUserData(O.none));
      return ex;
    })
  )();
