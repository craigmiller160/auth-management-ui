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

import { instance } from '../../src/services/Api';
import MockAdapter from 'axios-mock-adapter';
import { getAuthUser, logout } from '../../src/services/AuthService';
import { Either, isRight, Right } from 'fp-ts/es6/Either';
import store from '../../src/store';
import { MockStore, MockStoreCreator } from 'redux-mock-store';
import { AuthUser } from '../../src/types/auth';
import { Option, some } from 'fp-ts/es6/Option';

jest.mock('../../src/store', () => {
    const createMockStore = jest.requireActual('redux-mock-store').default;
    const { none, Option } = jest.requireActual('fp-ts/lib/Option');
    const store: MockStore<{ auth: { csrfToken: Option<string> } }> = createMockStore([])({ auth: { csrfToken: none } });
    return store;
})

const mockApi = new MockAdapter(instance);
const mockStore: MockStore<{ auth: { csrfToken: Option<string> } }> = store as MockStore;

const authUser: AuthUser = {
    username: 'user',
    firstName: 'first',
    lastName: 'last',
    roles: []
};

const csrfToken = 'CSRF';

describe('AuthService', () => {
    beforeEach(() => {
        mockStore.clearActions();
        mockApi.reset();
    });

    it('logout', async () => {
        mockApi.onGet('/auth-manage-ui/api/oauth/logout')
            .reply(200);
        const result = await logout();
        expect(isRight(result)).toEqual(true);
    });

    it('login', () => {
        throw new Error();
    });

    it('getAuthUser', async () => {
        mockApi.onGet('/auth-manage-ui/api/oauth/user')
            .reply((config) => {
                return [
                    200,
                    authUser,
                    {
                        'x-csrf-token': csrfToken
                    }
                ];
            });
        const result: Either<Error, AuthUser> = await getAuthUser();
        expect(isRight(result)).toEqual(true);
        expect((result as Right<AuthUser>).right).toEqual(authUser);
        expect(mockStore.getActions()).toEqual([
            {
                type: 'auth/setCsrfToken',
                payload: some(csrfToken)
            }
        ]);
    });

    it('getAuthUser set CSRF on failure', () => {
        throw new Error();
    });
});