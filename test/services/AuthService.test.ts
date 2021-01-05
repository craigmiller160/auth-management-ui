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

import MockAdapter from 'axios-mock-adapter';
import { Either, isLeft, isRight, Right } from 'fp-ts/es6/Either';
import { MockStore } from 'redux-mock-store';
import { Option, some } from 'fp-ts/es6/Option';
import { instance } from '../../src/services/Api';
import ajaxApi from '../../src/services/AjaxApi';
import { getAuthUser, login, logout } from '../../src/services/AuthService';
import store from '../../src/store';
import { AuthCodeLogin, AuthUser } from '../../src/types/auth';

jest.mock('../../src/store', () => {
    const createMockStore = jest.requireActual('redux-mock-store').default;
    const { none } = jest.requireActual('fp-ts/lib/Option');
    const theMockStore: MockStore<{ auth: { csrfToken: Option<string>; }; }> =
        createMockStore([])({ auth: { csrfToken: none } });
    return theMockStore;
});

const mockApi = new MockAdapter(instance);
const mockAjaxApi = new MockAdapter(ajaxApi.instance);
const mockStore: MockStore<{ auth: { csrfToken: Option<string>; }; }> = store as MockStore;

const authUser: AuthUser = {
    username: 'user',
    firstName: 'first',
    lastName: 'last',
    roles: []
};

const authCodeLogin: AuthCodeLogin = {
    url: 'theUrl'
};

const csrfToken = 'CSRF';

describe('AuthService', () => {
    beforeEach(() => {
        mockStore.clearActions();
        mockApi.reset();
    });

    it('logout', async () => {
        mockAjaxApi.onGet('/auth-manage-ui/api/oauth/logout')
            .reply(200);
        const result = await logout()();
        expect(isRight(result)).toEqual(true);
    });

    it('login', async () => {
        mockApi.onOptions('/auth-manage-ui/api/oauth/authcode/login')
            .reply(200, '', {});
        mockApi.onPost('/auth-manage-ui/api/oauth/authcode/login')
            .reply(200, authCodeLogin);
        const result = await login();
        expect(isRight(result)).toEqual(true);
        expect((result as Right<AuthCodeLogin>).right).toEqual(authCodeLogin);
        expect(window.location.assign).toHaveBeenCalledWith(authCodeLogin.url);
    });

    it('getAuthUser', async () => {
        mockApi.onGet('/auth-manage-ui/api/oauth/user')
            .reply(200, authUser);
        const result: Either<Error, AuthUser> = await getAuthUser();
        expect(isRight(result)).toEqual(true);
        expect((result as Right<AuthUser>).right).toEqual(authUser);
    });
});
