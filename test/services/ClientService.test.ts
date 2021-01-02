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
import { ClientDetailsWrapper, GraphQLQueryResponse, OldClientDetailsWrapper } from '../../src/types/graphApi';
import { ClientDetails, ClientListResponse, FullClientDetails } from '../../src/types/client';
import { mockCsrfPreflight } from './mockCsrf';
import { mockAndValidateGraphQL } from './mockAndValidateGraphQL';
import { instance } from '../../src/services/Api';
import { Either } from 'fp-ts/es6/Either';
import { getAllClients, getClientDetails, getFullClientDetails } from '../../src/services/ClientService';

const mockApi = new MockAdapter(instance);
const clientId = 1;
const client: ClientDetails = {
    id: 1,
    name: 'Client',
    clientKey: 'Key',
    enabled: true,
    accessTokenTimeoutSecs: 1,
    refreshTokenTimeoutSecs: 2,
    authCodeTimeoutSecs: 3,
    redirectUris: []
};
const fullClient: FullClientDetails = {
    ...client,
    roles: [],
    users: []
}

describe('ClientService', () => {
    beforeEach(() => {
        mockApi.reset();
    });
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
        const data: ClientListResponse = {
            clients: [
                {
                    id: 1,
                    name: 'Client',
                    clientKey: 'Key'
                }
            ]
        };
        const responseData: GraphQLQueryResponse<ClientListResponse> = {
            data
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, ClientListResponse> = await getAllClients();
        expect(result).toEqualRight(data);
    });

    it('getFullClientDetails', async () => {
        const payload = `
                query {
                    client(clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        enabled
                        refreshTokenTimeoutSecs
                        authCodeTimeoutSecs
                        redirectUris
                        roles {
                            id
                            name
                        }
                        users {
                            id
                            email
                            firstName
                            lastName
                            enabled
                            roles {
                                id
                                name
                            }
                        }
                    }
                }
            `;
        const data: OldClientDetailsWrapper = {
            client: fullClient
        };
        const responseData: GraphQLQueryResponse<OldClientDetailsWrapper> = {
            data
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, FullClientDetails> = await getFullClientDetails(clientId);
        expect(result).toEqualRight(fullClient);
    });

    it('getClientDetails', async () => {
        const payload = `
                query {
                    client(clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        refreshTokenTimeoutSecs
                        authCodeTimeoutSecs
                        enabled
                        redirectUris
                    }
                }
            `;
        const data: ClientDetailsWrapper = {
            client
        };
        const responseData: GraphQLQueryResponse<ClientDetailsWrapper> = {
            data
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, ClientDetails> = await getClientDetails(clientId);
        expect(result).toEqualRight(client);
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
