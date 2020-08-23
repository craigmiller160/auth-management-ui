import api from './Api';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import {
    ClientAuthDetails,
    ClientDetails,
    ClientInput,
    ClientListResponse,
    ClientRole,
    ClientUser,
    FullClientDetails
} from '../types/client';
import {
    AddUserToClientWrapper,
    ClientDetailsWrapper,
    CreateClientWrapper,
    DeleteClientWrapper, RemoveUserFromClientWrapper,
    RolesForClientWrapper,
    UpdateClientWrapper
} from '../types/graphApi';

export const getAllClients = (): Promise<Either<Error,ClientListResponse>> =>
    api.graphql<ClientListResponse>({
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
    });

export const getClient = async (clientId: number): Promise<Either<Error, FullClientDetails>> =>
    pipe(
        await api.graphql<ClientDetailsWrapper>({
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
        map((wrapper: ClientDetailsWrapper) => wrapper.client)
    );

export const getRolesForClient = async (clientId: number): Promise<Either<Error, Array<ClientRole>>> =>
    pipe(
        await api.graphql<RolesForClientWrapper>({
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
        await api.graphql<UpdateClientWrapper>({
            payload: `
                mutation {
                    updateClient(clientId: ${clientId}, client: {
                        name: "${clientInput.name}",
                        clientKey: "${clientInput.clientKey}",
                        clientSecret: "${clientInput.clientSecret || ''}",
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
        }),
        map((wrapper: UpdateClientWrapper) => wrapper.updateClient)
    );

export const createClient = async (clientInput: ClientInput): Promise<Either<Error,ClientDetails>> =>
    pipe(
        await api.graphql<CreateClientWrapper>({
            payload: `
                mutation {
                    createClient(client: {
                        name: "${clientInput.name}",
                        clientKey: "${clientInput.clientKey}",
                        clientSecret: "${clientInput.clientSecret}",
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
            errorMsg: 'Error creating client'
        }),
        map((wrapper: CreateClientWrapper) => wrapper.createClient)
    );

export const deleteClient = async (clientId: number): Promise<Either<Error, ClientDetails>> =>
    pipe(
        await api.graphql<DeleteClientWrapper>({
            payload: `
                mutation {
                    deleteClient(clientId: ${clientId}) {
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
            errorMsg: `Error deleting client ${clientId}`
        }),
        map((wrapper: DeleteClientWrapper) => wrapper.deleteClient)
    );

export const generateGuid = (): Promise<Either<Error, string>> =>
    api.get<string>({
        uri: '/userClients/guid',
        errorMsg: 'Error generating GUID'
    });

export const removeUserFromClient = async (userId: number, clientId: number): Promise<Either<Error, Array<ClientUser>>> =>
    pipe(
        await api.graphql<RemoveUserFromClientWrapper>({
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
        map((wrapper: RemoveUserFromClientWrapper) => wrapper.removeUserFromClient)
    );

export const addUserToClient = async (userId: number, clientId: number): Promise<Either<Error, Array<ClientUser>>> =>
    pipe(
        await api.graphql<AddUserToClientWrapper>({
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
        map((wrapper: AddUserToClientWrapper) => wrapper.addUserToClient)
    );

export const getClientAuthDetails = (clientId: number): Promise<Either<Error, ClientAuthDetails>> =>
    api.get<ClientAuthDetails>({
        uri: `/clients/auth/${clientId}`,
        errorMsg: `Error getting client auth details for ${clientId}`
    });

export const revokeClientAuthAccess = (clientId: number): Promise<Either<Error, ClientAuthDetails>> =>
    api.post<void,ClientAuthDetails>({
        uri: `/clients/auth/${clientId}/revoke`,
        errorMsg: `Error revoking auth access for client ${clientId}`
    });
