import api from './Api';
import graphApi from './GraphApi';
import { Option } from 'fp-ts/es6/Option';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { ClientDetails, FullClientDetails, ClientInput, ClientListResponse, ClientRole } from '../types/client';
import { ClientDetailsWrapper, RolesForClientWrapper } from '../types/graphApi';
import { Client, RoleList } from '../types/oldApi';

export const getAllClients = (): Promise<Either<Error,ClientListResponse>> =>
    graphApi.graphql<ClientListResponse>({
        payload: `
            query {
                clients {
                    id
                    name
                    clientKey
                }
            }
        `,
        errorMsg: 'Error getting all clients'
    });

export const getClient = async (clientId: number): Promise<Either<Error, FullClientDetails>> =>
    pipe(
        await graphApi.graphql<ClientDetailsWrapper>({
            payload: `
                query {
                    client(clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        allowAuthCode
                        allowClientCredentials
                        allowPassword
                        enabled
                        refreshTokenTimeoutSecs
                        roles {
                            id
                            name
                        }
                        users {
                            id
                            email
                            firstName
                            lastName
                        }
                    }
                }
            `,
            errorMsg: `Error getting client ${clientId}`
        }),
        map((wrapper: ClientDetailsWrapper) => wrapper.client)
    );

export const getRolesForClient = async (clientId: number): Promise<Either<Error, Array<ClientRole>>> =>
    pipe(
        await graphApi.graphql<RolesForClientWrapper>({
            payload: `
                query {
                    rolesForClient(clientId: ${clientId}) {
                        id
                        name
                    }
                }
            `,
            errorMsg: `Error getting roles for client ${clientId}`
        }),
        map((wrapper: RolesForClientWrapper) => wrapper.rolesForClient)
    );

export const updateClient = async (clientId: number, clientInput: ClientInput): Promise<Either<Error, ClientDetails>> =>
    pipe(
        await graphApi.graphql<ClientDetails>({
            payload: `
                mutation {
                    updateClient(clientId: ${clientId}, client: {
                        name: ${clientInput.name},
                        clientKey: ${clientInput.clientKey},
                        clientSecret: ${clientInput.clientSecret},
                        enabled: ${clientInput.enabled},
                        allowAuthCode: ${clientInput.allowAuthCode},
                        allowClientCredentials: ${clientInput.allowClientCredentials},
                        allowPassword: ${clientInput.allowPassword},
                        accessTokenTimeoutSecs: ${clientInput.accessTokenTimeoutSecs},
                        refreshTokenTimeoutSecs: ${clientInput.refreshTokenTimeoutSecs}
                    }) {
                        id
                        name
                        clientKey
                        accessTokenTimeoutSecs
                        allowAuthCode
                        allowClientCredentials
                        allowPassword
                        enabled
                        refreshTokenTimeoutSecs
                    }
                }
            `,
            errorMsg: `Error updating client ${clientId}`
        })
    );

// TODO refactor this at the end to use Either
export const generateGuid = (): Promise<Option<string>> =>
    api.get<string>({
        uri: '/clients/guid',
        errorMsg: 'Error generating GUID'
    });

export const createClient = (client: Client): Promise<Option<Client>> =>
    api.post<Client,Client>({
        uri: '/clients',
        body: client,
        errorMsg: 'Error creating client'
    });

export const deleteClient = (id: number): Promise<Option<Client>> =>
    api.delete<Client>({
        uri: `/clients/${id}`,
        errorMsg: `Error deleting client ${id}`
    });

export const createRole = (clientId: number, role: ClientRole): Promise<Option<ClientRole>> =>
    api.post<ClientRole,ClientRole>({
        uri: `/clients/${clientId}/roles`,
        body: role,
        errorMsg: `Error creating role for client ${clientId}`
    });

export const updateRole = (clientId: number, roleId: number, role: ClientRole): Promise<Option<ClientRole>> =>
    api.put<ClientRole,ClientRole>({
        uri: `/clients/${clientId}/roles/${roleId}`,
        body: role,
        errorMsg: `Error updating role ${roleId} for client ${clientId}`
    });

export const deleteRole = (clientId: number, roleId: number): Promise<Option<ClientRole>> =>
    api.delete<ClientRole>({
        uri: `/clients/${clientId}/roles/${roleId}`,
        errorMsg: `Error deleting role ${roleId} for client ${clientId}`
    });

export const getRoles = (clientId: number): Promise<Option<RoleList>> =>
    api.get<RoleList>({
        uri: `/clients/${clientId}/roles`,
        errorMsg: `Error getting roles for client ${clientId}`
    });
