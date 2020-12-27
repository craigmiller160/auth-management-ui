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
import { logout } from '../../src/services/AuthService';
import { isRight } from 'fp-ts/es6/Either';

const mockApi = new MockAdapter(instance);

describe('AuthService', () => {
    beforeEach(() => {
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

    it('getAuthUser', () => {
        throw new Error();
    });

    it('getAuthUser set CSRF on failure', () => {
        throw new Error();
    });
});