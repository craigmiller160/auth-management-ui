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
import { Either } from 'fp-ts/es6/Either';
import {
  mockCsrfPreflight,
  mockAndValidateGraphQL,
} from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';
import {
  AddUserToClientWrapper,
  ClientDetailsWrapper,
  ClientRolesWrapper,
  CreateClientWrapper,
  DeleteClientWrapper,
  GraphQLQueryResponse,
  OldClientDetailsWrapper,
  RemoveUserFromClientWrapper,
  UpdateClientWrapper,
} from '../../src/types/graphApi';
import {
  ClientAuthDetails,
  ClientDetails,
  ClientInput,
  ClientListResponse,
  ClientUser,
  ClientWithRoles,
  FullClientDetails,
} from '../../src/types/client';
import ajaxApi from '../../src/services/AjaxApi';
import {
  addUserToClient,
  createClient,
  deleteClient,
  generateGuid,
  getAllClients,
  getAuthDetailsForClient,
  getClientDetails,
  getClientWithRoles,
  getFullClientDetails,
  removeUserFromClient,
  updateClient,
} from '../../src/services/ClientService';

const mockAjaxApi = new MockAdapter(ajaxApi.instance);
const clientId = 1;
const userId = 1;
const client: ClientDetails = {
  id: 1,
  name: 'Client',
  clientKey: 'Key',
  enabled: true,
  accessTokenTimeoutSecs: 1,
  refreshTokenTimeoutSecs: 2,
  authCodeTimeoutSecs: 3,
  redirectUris: [],
};
const fullClient: FullClientDetails = {
  ...client,
  roles: [],
  users: [],
};
const clientInput: ClientInput = {
  ...client,
  clientSecret: 'ABCDEFG',
};
const clientUsers = [
  {
    id: 1,
    email: 'user@gmail.com',
    firstName: 'Bob',
    lastName: 'Saget',
    enabled: true,
    roles: [
      {
        id: 1,
        name: 'Role',
      },
    ],
  },
];

describe('ClientService', () => {
  beforeEach(() => {
    mockAjaxApi.reset();
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
          clientKey: 'Key',
        },
      ],
    };
    const responseData: GraphQLQueryResponse<ClientListResponse> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientListResponse> = await getAllClients()();
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
      client: fullClient,
    };
    const responseData: GraphQLQueryResponse<OldClientDetailsWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, FullClientDetails> = await getFullClientDetails(
      clientId,
    )();
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
      client,
    };
    const responseData: GraphQLQueryResponse<ClientDetailsWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientDetails> = await getClientDetails(
      clientId,
    )();
    expect(result).toEqualRight(client);
  });

  it('getClientWithRoles', async () => {
    const payload = `
                query {
                    client(clientId: ${clientId}) {
                        id
                        name
                        roles {
                            id
                            name
                        }
                    }
                }
            `;
    const data: ClientRolesWrapper = {
      client: {
        id: clientId,
        name: 'Client',
        roles: [
          {
            id: 1,
            name: 'Role',
          },
        ],
      },
    };
    const responseData: GraphQLQueryResponse<ClientRolesWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientWithRoles> = await getClientWithRoles(
      clientId,
    )();
    expect(result).toEqualRight(data.client);
  });

  it('updateClient', async () => {
    const payload = `
                mutation {
                    updateClient(clientId: ${clientId}, client: {
                        name: "${clientInput.name}",
                        clientKey: "${clientInput.clientKey}",
                        clientSecret: "${clientInput.clientSecret || ''}",
                        enabled: ${clientInput.enabled},
                        accessTokenTimeoutSecs: ${
                          clientInput.accessTokenTimeoutSecs
                        },
                        refreshTokenTimeoutSecs: ${
                          clientInput.refreshTokenTimeoutSecs
                        },
                        authCodeTimeoutSecs: ${clientInput.authCodeTimeoutSecs},
                        redirectUris: [${clientInput.redirectUris
                          .map((uri) => `"${uri}"`)
                          .join(',')}]
                    }) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        enabled
                        refreshTokenTimeoutSecs
                        authCodeTimeoutSecs
                        redirectUris
                    }
                }
            `;
    const data: UpdateClientWrapper = {
      updateClient: client,
    };
    const responseData: GraphQLQueryResponse<UpdateClientWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientDetails> = await updateClient(
      clientId,
      clientInput,
    )();
    expect(result).toEqualRight(data.updateClient);
  });

  it('createClient', async () => {
    const payload = `
                mutation {
                    createClient(client: {
                        name: "${clientInput.name}",
                        clientKey: "${clientInput.clientKey}",
                        clientSecret: "${clientInput.clientSecret}",
                        enabled: ${clientInput.enabled},
                        accessTokenTimeoutSecs: ${
                          clientInput.accessTokenTimeoutSecs
                        },
                        refreshTokenTimeoutSecs: ${
                          clientInput.refreshTokenTimeoutSecs
                        },
                        authCodeTimeoutSecs: ${clientInput.authCodeTimeoutSecs},
                        redirectUris: [${clientInput.redirectUris
                          .map((uri) => `"${uri}"`)
                          .join(',')}]
                    }) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        enabled
                        refreshTokenTimeoutSecs
                        authCodeTimeoutSecs
                        redirectUris
                    }
                }
            `;
    const data: CreateClientWrapper = {
      createClient: client,
    };
    const responseData: GraphQLQueryResponse<CreateClientWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientDetails> = await createClient(
      clientInput,
    )();
    expect(result).toEqualRight(client);
  });

  it('deleteClient', async () => {
    const payload = `
                mutation {
                    deleteClient(clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        enabled
                        refreshTokenTimeoutSecs
                        authCodeTimeoutSecs
                        redirectUris
                    }
                }
            `;
    const data: DeleteClientWrapper = {
      deleteClient: client,
    };
    const responseData: GraphQLQueryResponse<DeleteClientWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientDetails> = await deleteClient(clientId)();
    expect(result).toEqualRight(client);
  });

  it('generateGuid', async () => {
    mockAjaxApi.onGet('/clients/guid').reply(200, 'Success');
    const result: Either<Error, string> = await generateGuid()();
    expect(result).toEqualRight('Success');
  });

  it('removeUserFromClient', async () => {
    const payload = `
                mutation {
                    removeUserFromClient(userId: ${userId}, clientId: ${clientId}) {
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
            `;
    const data: RemoveUserFromClientWrapper = {
      removeUserFromClient: clientUsers,
    };
    const responseData: GraphQLQueryResponse<RemoveUserFromClientWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientUser[]> = await removeUserFromClient(
      userId,
      clientId,
    )();
    expect(result).toEqualRight(clientUsers);
  });

  it('addUserToClient', async () => {
    const payload = `
                mutation {
                    addUserToClient(userId: ${userId}, clientId: ${clientId}) {
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
            `;
    const data: AddUserToClientWrapper = {
      addUserToClient: clientUsers,
    };
    const responseData: GraphQLQueryResponse<AddUserToClientWrapper> = {
      data,
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData,
    });
    const result: Either<Error, ClientUser[]> = await addUserToClient(
      userId,
      clientId,
    )();
    expect(result).toEqualRight(clientUsers);
  });

  it('getAuthDetailsForClient', async () => {
    const authDetails: ClientAuthDetails = {
      clientName: 'Client',
      userAuthDetails: [
        {
          clientId,
          clientName: 'Client',
          userId,
          userEmail: 'user@gmail.com',
          lastAuthenticated: null,
        },
      ],
    };
    mockAjaxApi.onGet(`/clients/auth/${clientId}`).reply(200, authDetails);
    const result: Either<
      Error,
      ClientAuthDetails
    > = await getAuthDetailsForClient(clientId)();
    expect(result).toEqualRight(authDetails);
  });
});
