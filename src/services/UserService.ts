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

import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import * as TE from 'fp-ts/es6/TaskEither';
import {
    UserAuthDetailsList,
    UserClient,
    UserClients,
    UserDetails,
    UserInput,
    UserList,
    UserRole
} from '../types/user';
import api from './Api';
import ajaxApi from './AjaxApi';
import {
    AddClientToUserWrapper,
    AddRoleToUserWrapper,
    CreateUserWrapper,
    DeleteUserWrapper,
    RemoveClientFromUserWrapper,
    RemoveRoleFromUserWrapper,
    UpdateUserWrapper,
    UserClientsWrapper,
    UserDetailsWrapper
} from '../types/graphApi';
import { TaskEither } from 'fp-ts/es6/TaskEither';
import { AxiosResponse } from 'axios';
import { GraphQLQueryResponse } from '@craigmiller160/ajax-api-fp-ts';

export const getAllUsers = (): TaskEither<Error, UserList> =>
    pipe(
        ajaxApi.graphql<UserList>({
            payload: `
                query {
                    users {
                        id
                        email
                        firstName
                        lastName
                    }
                }
            `,
            errorMsg: 'Error getting all users'
        }),
        TE.map((res: AxiosResponse<GraphQLQueryResponse<UserList>>) => res.data.data)
    );

export const getUserDetails = (userId: number): TE.TaskEither<Error, UserDetails> =>
    pipe(
        ajaxApi.graphql<UserDetailsWrapper>({
            payload: `
                query {
                    user(userId: ${userId}) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `,
            errorMsg: `Error getting user details for ${userId}`
        }),
        TE.map((res: AxiosResponse<GraphQLQueryResponse<UserDetailsWrapper>>) => res.data.data.user)
    );

export const getUserClients = (userId: number): TE.TaskEither<Error, UserClients> =>
    pipe(
        ajaxApi.graphql<UserClientsWrapper>({
            payload: `
                query {
                    user(userId: ${userId}) {
                        id
                        email
                        clients {
                            id
                            name
                            clientKey
                            allRoles {
                                id
                                name
                            }
                            userRoles {
                                id
                                name
                            }
                        }
                    }
                }
            `,
            errorMsg: `Error getting user clients for ${userId}`
        }),
        TE.map((res: AxiosResponse<GraphQLQueryResponse<UserClientsWrapper>>) => res.data.data.user)
    );

export const updateUser = (userId: number, user: UserInput): TE.TaskEither<Error, UserDetails> =>
    pipe(
        ajaxApi.graphql<UpdateUserWrapper>({
            payload: `
                mutation {
                    updateUser(userId: ${userId}, user: {
                        email: "${user.email}",
                        password: "${user.password || ''}",
                        firstName: "${user.firstName}",
                        lastName: "${user.lastName}",
                        enabled: ${user.enabled}
                    }) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `,
            errorMsg: `Error updating user ${userId}`
        }),
        TE.map((res: AxiosResponse<GraphQLQueryResponse<UpdateUserWrapper>>) => res.data.data.updateUser)
    );

export const createUser = (user: UserInput): TE.TaskEither<Error, UserDetails> =>
    pipe(
        ajaxApi.graphql<CreateUserWrapper>({
            payload: `
                mutation {
                    createUser(user: {
                        email: "${user.email}",
                        password: "${user.password}",
                        firstName: "${user.firstName}",
                        lastName: "${user.lastName}",
                        enabled: ${user.enabled}
                    }) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }                  
                }
            `,
            errorMsg: 'Error creating user'
        }),
        TE.map((res: AxiosResponse<GraphQLQueryResponse<CreateUserWrapper>>) => res.data.data.createUser)
    );

export const deleteUser = async (userId: number): Promise<Either<Error, UserDetails>> =>
    pipe(
        await api.graphql<DeleteUserWrapper>({
            payload: `
                mutation {
                    deleteUser(userId: ${userId}) {
                        id
                        email
                        firstName
                        lastName
                        enabled
                    }
                }
            `,
            errorMsg: `Error deleting user ${userId}`
        }),
        map((wrapper: DeleteUserWrapper) => wrapper.deleteUser)
    );

export const removeClientFromUser = async (userId: number, clientId: number):
    Promise<Either<Error, Array<UserClient>>> =>
    pipe(
        await api.graphql<RemoveClientFromUserWrapper>({
            payload: `
                mutation {
                    removeClientFromUser(userId: ${userId}, clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        allRoles {
                            id
                            name
                        }
                        userRoles {
                            id
                            name
                        }
                    }
                }
            `,
            errorMsg: `Error removing client ${clientId} from user ${userId}`
        }),
        map((wrapper: RemoveClientFromUserWrapper) => wrapper.removeClientFromUser)
    );

export const addClientToUser = async (userId: number, clientId: number): Promise<Either<Error, Array<UserClient>>> =>
    pipe(
        await api.graphql<AddClientToUserWrapper>({
            payload: `
                mutation {
                    addClientToUser(userId: ${userId}, clientId: ${clientId}) {
                        id
                        name
                        clientKey
                        allRoles {
                            id
                            name
                        }
                        userRoles {
                            id
                            name
                        }
                    }
                }
            `,
            errorMsg: `Error adding client ${clientId} to user ${userId}`
        }),
        map((wrapper: AddClientToUserWrapper) => wrapper.addClientToUser)
    );

export const removeRoleFromUser = async (userId: number, clientId: number, roleId: number):
    Promise<Either<Error, Array<UserRole>>> =>
    pipe(
        await api.graphql<RemoveRoleFromUserWrapper>({
            payload: `
                mutation {
                    removeRoleFromUser(userId: ${userId}, clientId: ${clientId}, roleId: ${roleId}) {
                        id
                        name
                    }
                }
            `,
            errorMsg: `Error removing role ${roleId} from user ${userId}`
        }),
        map((wrapper: RemoveRoleFromUserWrapper) => wrapper.removeRoleFromUser)
    );

export const addRoleToUser = async (userId: number, clientId: number, roleId: number):
    Promise<Either<Error, Array<UserRole>>> =>
    pipe(
        await api.graphql<AddRoleToUserWrapper>({
            payload: `
                mutation {
                    addRoleToUser(userId: ${userId}, clientId: ${clientId}, roleId: ${roleId}) {
                        id
                        name
                    }
                }
            `,
            errorMsg: `Error adding role ${roleId} to user ${userId}`
        }),
        map((wrapper: AddRoleToUserWrapper) => wrapper.addRoleToUser)
    );

export const getAllUserAuthDetails = async (userId: number): Promise<Either<Error, UserAuthDetailsList>> =>
    api.get<UserAuthDetailsList>({
        uri: `/users/auth/${userId}`,
        errorMsg: `Error getting all auth details for user ${userId}`
    });

export const revokeUserAuthAccess = async (userId: number, clientId: number): Promise<Either<Error, void>> =>
    api.post<void, void>({
        uri: `/users/auth/${userId}/${clientId}/revoke`,
        errorMsg: `Error revoking access for user ${userId} for client ${clientId}`
    });
