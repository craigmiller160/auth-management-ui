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
import * as TE from 'fp-ts/es6/TaskEither';
import { AxiosResponse } from 'axios';
import { GraphQLQueryResponse } from '@craigmiller160/ajax-api-fp-ts';
import ajaxApi from './AjaxApi';
import {
	ClientAuthDetails,
	ClientDetails,
	ClientInput,
	ClientListResponse,
	ClientUser,
	ClientWithRoles,
	FullClientDetails
} from '../types/client';
import {
	AddUserToClientWrapper,
	ClientDetailsWrapper,
	ClientRolesWrapper,
	CreateClientWrapper,
	DeleteClientWrapper,
	FullClientDetailsWrapper,
	RemoveUserFromClientWrapper,
	UpdateClientWrapper
} from '../types/graphApi';

export const getAllClients = (): TE.TaskEither<Error, ClientListResponse> =>
	pipe(
		ajaxApi.graphql<ClientListResponse>({
			payload: `
                query {
                    clients {
                        id
                        name
                        clientKey
                    }
                }
            `,
			errorMsg: 'Error getting all userClients'
		}),
		TE.map(
			(res: AxiosResponse<GraphQLQueryResponse<ClientListResponse>>) =>
				res.data.data
		)
	);

export const getFullClientDetails = (
	clientId: number
): TE.TaskEither<Error, FullClientDetails> =>
	pipe(
		ajaxApi.graphql<FullClientDetailsWrapper>({
			payload: `
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
            `,
			errorMsg: `Error getting client ${clientId}`
		}),
		TE.map(
			(
				res: AxiosResponse<
					GraphQLQueryResponse<FullClientDetailsWrapper>
				>
			) => res.data.data.client
		)
	);

export const getClientDetails = (
	clientId: number
): TE.TaskEither<Error, ClientDetails> =>
	pipe(
		ajaxApi.graphql<ClientDetailsWrapper>({
			payload: `
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
            `,
			errorMsg: `Error getting client ${clientId}`
		}),
		TE.map(
			(res: AxiosResponse<GraphQLQueryResponse<ClientDetailsWrapper>>) =>
				res.data.data.client
		)
	);

export const getClientWithRoles = (
	clientId: number
): TE.TaskEither<Error, ClientWithRoles> =>
	pipe(
		ajaxApi.graphql<ClientRolesWrapper>({
			payload: `
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
            `,
			errorMsg: `Error getting roles for client ${clientId}`
		}),
		TE.map(
			(res: AxiosResponse<GraphQLQueryResponse<ClientRolesWrapper>>) =>
				res.data.data.client
		)
	);

export const updateClient = (
	clientId: number,
	clientInput: ClientInput
): TE.TaskEither<Error, ClientDetails> =>
	pipe(
		ajaxApi.graphql<UpdateClientWrapper>({
			payload: `
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
            `,
			errorMsg: `Error updating client ${clientId}`
		}),
		TE.map(
			(res: AxiosResponse<GraphQLQueryResponse<UpdateClientWrapper>>) =>
				res.data.data.updateClient
		)
	);

export const createClient = (
	clientInput: ClientInput
): TE.TaskEither<Error, ClientDetails> =>
	pipe(
		ajaxApi.graphql<CreateClientWrapper>({
			payload: `
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
            `,
			errorMsg: 'Error creating client'
		}),
		TE.map(
			(res: AxiosResponse<GraphQLQueryResponse<CreateClientWrapper>>) =>
				res.data.data.createClient
		)
	);

export const deleteClient = (
	clientId: number
): TE.TaskEither<Error, ClientDetails> =>
	pipe(
		ajaxApi.graphql<DeleteClientWrapper>({
			payload: `
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
            `,
			errorMsg: `Error deleting client ${clientId}`
		}),
		TE.map(
			(res: AxiosResponse<GraphQLQueryResponse<DeleteClientWrapper>>) =>
				res.data.data.deleteClient
		)
	);

export const generateGuid = (): TE.TaskEither<Error, string> =>
	pipe(
		ajaxApi.get<string>({
			uri: '/clients/guid',
			errorMsg: 'Error generating GUID'
		}),
		TE.map((res: AxiosResponse<string>) => res.data)
	);

export const removeUserFromClient = (
	userId: number,
	clientId: number
): TE.TaskEither<Error, Array<ClientUser>> =>
	pipe(
		ajaxApi.graphql<RemoveUserFromClientWrapper>({
			payload: `
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
            `,
			errorMsg: `Error removing user ${userId} from client ${clientId}`
		}),
		TE.map(
			(
				res: AxiosResponse<
					GraphQLQueryResponse<RemoveUserFromClientWrapper>
				>
			) => res.data.data.removeUserFromClient
		)
	);

export const addUserToClient = (
	userId: number,
	clientId: number
): TE.TaskEither<Error, Array<ClientUser>> =>
	pipe(
		ajaxApi.graphql<AddUserToClientWrapper>({
			payload: `
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
            `,
			errorMsg: `Error adding user ${userId} to client ${clientId}`
		}),
		TE.map(
			(
				res: AxiosResponse<GraphQLQueryResponse<AddUserToClientWrapper>>
			) => res.data.data.addUserToClient
		)
	);

export const getAuthDetailsForClient = (
	clientId: number
): TE.TaskEither<Error, ClientAuthDetails> =>
	pipe(
		ajaxApi.get<ClientAuthDetails>({
			uri: `/clients/auth/${clientId}`,
			errorMsg: `Error getting auth details for client ${clientId}`
		}),
		TE.map((res: AxiosResponse<ClientAuthDetails>) => res.data)
	);
