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
import { instance } from '../../src/services/Api';
import { UserDetails, UserList } from '../../src/types/user';
import { GraphQLQueryResponse, UserDetailsWrapper } from '../../src/types/graphApi';
import { mockCsrfPreflight } from './mockCsrf';
import { mockAndValidateGraphQL } from './mockAndValidateGraphQL';
import { Either } from 'fp-ts/es6/Either';
import { getAllUsers, getUserDetails } from '../../src/services/UserService';

const mockApi = new MockAdapter(instance);
const clientId = 1;
const userId = 1;
const user: UserDetails = {
    id: 1,
    email: 'user@gmail.com',
    firstName: 'Bob',
    lastName: 'Saget',
    enabled: true
};

describe('UserService', () => {
    beforeEach(() => {
        mockApi.reset();
    });

    it('getAllUsers', async () => {
        const payload = `
                query {
                    users {
                        id
                        email
                        firstName
                        lastName
                    }
                }
            `;
        const data: UserList = {
            users: [
                user
            ]
        };
        const responseData: GraphQLQueryResponse<UserList> = {
            data
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, UserList> = await getAllUsers();
        expect(result).toEqualRight(data);
    });

    it('getUserDetails', async () => {
        const payload = `
                query {
                    user(userId: ${userId}) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `;
        const responseData: GraphQLQueryResponse<UserDetailsWrapper> = {
            data: {
                user
            }
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, UserDetails> = await getUserDetails(userId);
        expect(result).toEqualRight(user);
    });

    it('getUserClients', () => {
        throw new Error();
    });

    it('updateUser', () => {
        throw new Error();
    });

    it('createUser', () => {
        throw new Error();
    });

    it('deleteUser', () => {
        throw new Error();
    });

    it('removeClientFromUser', () => {
        throw new Error();
    });

    it('addClientToUser', () => {
        throw new Error();
    });

    it('removeRoleFromUser', () => {
        throw new Error();
    });

    it('addRoleToUser', () => {
        throw new Error();
    });

    it('getAllUserAuthDetails', () => {
        throw new Error();
    });

    it('revokeUserAuthAccess', () => {
        throw new Error();
    });
});
