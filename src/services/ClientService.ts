import api from './Api';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { ClientDetails, ClientInput, ClientListResponse, ClientRole, FullClientDetails } from '../types/client';
import {
    ClientDetailsWrapper,
    CreateClientWrapper,
    DeleteClientWrapper,
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
        errorMsg: 'Error getting all clients'
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
        uri: '/clients/guid',
        errorMsg: 'Error generating GUID'
    });
