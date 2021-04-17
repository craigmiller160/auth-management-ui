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
import { TaskEither } from 'fp-ts/es6/TaskEither';
import { AxiosResponse } from 'axios';
import { GraphQLQueryResponse } from '@craigmiller160/ajax-api-fp-ts';
import {
  UserAuthDetailsList,
  UserClient,
  UserClients,
  UserDetails,
  UserInput,
  UserList,
  UserRole
} from '../types/user';
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<UserList>>) => res.data.data
    )
  );

export const getUserDetails = (
  userId: number
): TE.TaskEither<Error, UserDetails> =>
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<UserDetailsWrapper>>) =>
        res.data.data.user
    )
  );

export const getUserClients = (
  userId: number
): TE.TaskEither<Error, UserClients> =>
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<UserClientsWrapper>>) =>
        res.data.data.user
    )
  );

export const updateUser = (
  userId: number,
  user: UserInput
): TE.TaskEither<Error, UserDetails> =>
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<UpdateUserWrapper>>) =>
        res.data.data.updateUser
    )
  );

export const createUser = (
  user: UserInput
): TE.TaskEither<Error, UserDetails> =>
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<CreateUserWrapper>>) =>
        res.data.data.createUser
    )
  );

export const deleteUser = (userId: number): TE.TaskEither<Error, UserDetails> =>
  pipe(
    ajaxApi.graphql<DeleteUserWrapper>({
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<DeleteUserWrapper>>) =>
        res.data.data.deleteUser
    )
  );

export const removeClientFromUser = (
  userId: number,
  clientId: number
): TE.TaskEither<Error, UserClient[]> =>
  pipe(
    ajaxApi.graphql<RemoveClientFromUserWrapper>({
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<RemoveClientFromUserWrapper>>) =>
        res.data.data.removeClientFromUser
    )
  );

export const addClientToUser = (
  userId: number,
  clientId: number
): TE.TaskEither<Error, UserClient[]> =>
  pipe(
    ajaxApi.graphql<AddClientToUserWrapper>({
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<AddClientToUserWrapper>>) =>
        res.data.data.addClientToUser
    )
  );

export const removeRoleFromUser = (
  userId: number,
  clientId: number,
  roleId: number
): TE.TaskEither<Error, UserRole[]> =>
  pipe(
    ajaxApi.graphql<RemoveRoleFromUserWrapper>({
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<RemoveRoleFromUserWrapper>>) =>
        res.data.data.removeRoleFromUser
    )
  );

export const addRoleToUser = (
  userId: number,
  clientId: number,
  roleId: number
): TE.TaskEither<Error, UserRole[]> =>
  pipe(
    ajaxApi.graphql<AddRoleToUserWrapper>({
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
    TE.map(
      (res: AxiosResponse<GraphQLQueryResponse<AddRoleToUserWrapper>>) =>
        res.data.data.addRoleToUser
    )
  );

export const getAllUserAuthDetails = (
  userId: number
): TE.TaskEither<Error, UserAuthDetailsList> =>
  pipe(
    ajaxApi.get<UserAuthDetailsList>({
      uri: `/users/auth/${userId}`,
      errorMsg: `Error getting all auth details for user ${userId}`
    }),
    TE.map((res: AxiosResponse<UserAuthDetailsList>) => res.data)
  );

export const revokeUserAuthAccess = (
  userId: number,
  clientId: number
): TE.TaskEither<Error, void> =>
  pipe(
    ajaxApi.post<void, void>({
      uri: `/users/auth/${userId}/${clientId}/revoke`,
      errorMsg: `Error revoking access for user ${userId} for client ${clientId}`
    }),
    TE.map((res: AxiosResponse<void>) => res.data)
  );
