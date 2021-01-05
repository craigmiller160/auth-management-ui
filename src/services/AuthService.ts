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

import { bimap, Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import api, { isAxiosError } from './Api';
import ajaxApi from './AjaxApi';
import { AuthCodeLogin, AuthUser } from '../types/auth';
import { TaskEither } from 'fp-ts/es6/TaskEither';
import { AxiosResponse } from 'axios';

export const logout = (): TaskEither<Error, AxiosResponse<void>> =>
    ajaxApi.get<void>({
        uri: '/oauth/logout',
        errorMsg: 'Error logging out'
    });

export const login = async (): Promise<Either<Error, AuthCodeLogin>> =>
    pipe(
        await api.post<void, AuthCodeLogin>({
            uri: '/oauth/authcode/login',
            errorMsg: 'Error getting login URL'
        }),
        map((loginData: AuthCodeLogin) => {
            window.location.assign(loginData.url);
            return loginData;
        })
    );

export const getAuthUser = async (): Promise<Either<Error, AuthUser>> =>
    pipe(
        await api.get<AuthUser>({
            uri: '/oauth/user',
            errorMsg: 'Error getting authenticated user',
            suppressError: (ex: Error) => {
                if (isAxiosError(ex)) {
                    return ex.response?.status === 401;
                }
                return false;
            }
        })
    );
