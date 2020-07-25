import api from './Api';
import { FullUser, User, UserList } from '../types/api';
import { Option } from 'fp-ts/es6/Option';

export const getUsers = (): Promise<Option<UserList>> =>
    api.get<UserList>({
        uri: '/users',
        errorMsg: 'Error getting all users'
    });

export const getUser = (id: number): Promise<Option<FullUser>> =>
    api.get<FullUser>({
        uri: `/users/${id}`,
        errorMsg: `Error getting user ${id}`
    });

export const updateUser = (id: number, user: User): Promise<Option<User>> =>
    api.put<User,User>({
        uri: `/users/${id}`,
        body: user,
        errorMsg: `Error updating user ${id}`
    });

export const createUser = (user: User): Promise<Option<FullUser>> =>
    api.post<User,FullUser>({
        uri: '/users',
        body: user,
        errorMsg: 'Error creating user'
    });

export const deleteUser = (id: number): Promise<Option<FullUser>> =>
    api.delete<FullUser>({
        uri: `/users/${id}`,
        errorMsg: `Error deleting user ${id}`
    });
