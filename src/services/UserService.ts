// import { FullUser, User, UserList } from '../types/oldApi';
import { Either, map } from 'fp-ts/es6/Either';
import { FullUserDetails, UserDetails, UserInput, UserList } from '../types/user';
import { pipe } from 'fp-ts/es6/pipeable';
import api from './Api';
import { CreateUserWrapper, DeleteUserWrapper, UpdateUserWrapper, UserDetailsWrapper } from '../types/graphApi';

export const getUsers = async (): Promise<Either<Error,UserList>> =>
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

export const getUser = async (userId: number): Promise<Either<Error, FullUserDetails>> =>
    pipe(
        await api.graphql<UserDetailsWrapper>({
            payload: `
                query {
                    user(userId: ${userId}) {
                        id
                        email
                        firstName
                        lastName
                    }
                }
            `,
            errorMsg: `Error getting user ${userId}`
        }),
        map((wrapper: UserDetailsWrapper) => wrapper.user)
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
                        lastName: "${user.lastName}"
                    }) {
                        id
                        email
                        firstName
                        lastName
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
                        lastName: "${user.lastName}"
                    }) {
                        id
                        email
                        firstName
                        lastName
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
                    }
                }
            `,
            errorMsg: `Error deleting user ${userId}`
        }),
        map((wrapper: DeleteUserWrapper) => wrapper.deleteUser)
    );
