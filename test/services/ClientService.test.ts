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
import { GraphQLQueryResponse } from '../../src/types/graphApi';
import { ClientListResponse } from '../../src/types/client';
import { mockCsrfPreflight } from './mockCsrf';
import { mockAndValidateGraphQL } from './mockAndValidateGraphQL';
import { instance } from '../../src/services/Api';
import { Either } from 'fp-ts/es6/Either';
import { getAllClients } from '../../src/services/ClientService';

const mockApi = new MockAdapter(instance);

describe('ClientService', () => {
    it('getAllClients', async () => {
        const payload = `
            query {
                clients {
                    id
                    name
                    clientKey
                }
            }
        `;
        const responseData: GraphQLQueryResponse<ClientListResponse> = {
            data: {
                clients: [
                    {
                        id: 1,
                        name: 'Client',
                        clientKey: 'Key'
                    }
                ]
            }
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, ClientListResponse> = await getAllClients();
        expect(result).toEqualRight({
            clients: [
                {
                    id: 1,
                    name: 'Client',
                    clientKey: 'Key'
                }
            ]
        });
    });

    it('getFullClientDetails', () => {
        throw new Error();
    });

    it('getClientDetails', () => {
        throw new Error();
    });

    it('getClientWithRoles', () => {
        throw new Error();
    });

    it('updateClient', () => {
        throw new Error();
    });

    it('createClient', () => {
        throw new Error();
    });

    it('deleteClient', () => {
        throw new Error();
    });

    it('generateGuid', () => {
        throw new Error();
    });

    it('removeUserFromClient', () => {
        throw new Error();
    });

    it('addUserToClient', () => {
        throw new Error();
    });

    it('getAuthDetailsForClient', () => {
        throw new Error();
    });
});
