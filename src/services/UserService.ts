import { Either, map } from 'fp-ts/es6/Either';
import {
    FullUserDetails,
    UserAuthDetails, UserAuthDetailsList,
    UserClient, UserClients,
    UserDetails,
    UserInput,
    UserList,
    UserRole
} from '../types/user';
import { pipe } from 'fp-ts/es6/pipeable';
import api from './Api';
import {
    AddClientToUserWrapper, AddRoleToUserWrapper,
    CreateUserWrapper,
    DeleteUserWrapper,
    RemoveClientFromUserWrapper, RemoveRoleFromUserWrapper,
    UpdateUserWrapper,
    UserDetailsWrapper, UserClientsWrapper
} from '../types/graphApi';

export const getAllUsers = async (): Promise<Either<Error,UserList>> =>
    pipe(
        await api.graphql<UserList>({
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
        })
    );

export const getUserDetails = async (userId: number): Promise<Either<Error,UserDetails>> =>
    pipe(
        await api.graphql<UserDetailsWrapper>({
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
        map((wrapper: UserDetailsWrapper) => wrapper.user)
    );

export const getUserClients = async (userId: number): Promise<Either<Error,UserClients>> =>
    pipe(
        await api.graphql<UserClientsWrapper>({
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
        map((wrapper: UserClientsWrapper) => wrapper.user)
    );

export const updateUser = async (userId: number, user: UserInput): Promise<Either<Error, UserDetails>> =>
    pipe(
        await api.graphql<UpdateUserWrapper>({
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
        map((wrapper: UpdateUserWrapper) => wrapper.updateUser)
    );

export const createUser = async (user: UserInput): Promise<Either<Error, UserDetails>> =>
    pipe(
        await api.graphql<CreateUserWrapper>({
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
        map((wrapper: CreateUserWrapper) => wrapper.createUser)
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

export const removeClientFromUser = async (userId: number, clientId: number): Promise<Either<Error,Array<UserClient>>> =>
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

export const removeRoleFromUser = async (userId: number, clientId: number, roleId: number): Promise<Either<Error, Array<UserRole>>> =>
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

export const addRoleToUser = async (userId: number, clientId: number, roleId: number): Promise<Either<Error, Array<UserRole>>> =>
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

export const getAllUserAuthDetails = async (userId: number): Promise<Either<Error,UserAuthDetailsList>> =>
    api.get<UserAuthDetailsList>({
        uri: `/users/auth/${userId}`,
        errorMsg: `Error getting all auth details for user ${userId}`
    });

export const revokeUserAuthAccess = async (userId: number, clientId: number): Promise<Either<Error,UserAuthDetails>> =>
    api.post<void,UserAuthDetails>({
        uri: `/users/auth/${userId}/${clientId}/revoke`,
        errorMsg: `Error revoking access for user ${userId} for client ${clientId}`
    });
