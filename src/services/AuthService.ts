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

import { pipe } from 'fp-ts/es6/pipeable';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';
import * as TE from 'fp-ts/es6/TaskEither';
import { AxiosResponse } from 'axios';
import { AuthCodeLogin, AuthUser } from '../types/auth';
import ajaxApi from './AjaxApi';

export const logout = (): TE.TaskEither<Error, AxiosResponse<void>> =>
    ajaxApi.get<void>({
        uri: '/oauth/logout',
        errorMsg: 'Error logging out'
    });

export const login = (): TE.TaskEither<Error, AuthCodeLogin> =>
    pipe(
        ajaxApi.post<void, AuthCodeLogin>({
            uri: '/oauth/authcode/login',
            errorMsg: 'Error getting login URL'
        }),
        TE.map((res: AxiosResponse<AuthCodeLogin>) => res.data),
        TE.map((loginData: AuthCodeLogin) => {
            window.location.assign(loginData.url);
            return loginData;
        })
    );

export const getAuthUser = (): TE.TaskEither<Error, AuthUser> =>
    pipe(
        ajaxApi.get<AuthUser>({
            uri: '/oauth/user',
            errorMsg: 'Error getting authenticated user',
            suppressError: (ex: Error) => {
                if (isAxiosError(ex)) {
                    return ex.response?.status === 401;
                }
                return false;
            }
        }),
        TE.map((res: AxiosResponse<AuthUser>) => res.data)
    );
