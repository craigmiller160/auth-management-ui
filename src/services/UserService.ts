import api from './Api';
import { UserList } from '../types/api';

export const getUsers = (): Promise<UserList | undefined> =>
    api.get<UserList>({
        uri: '/users',
        errorMsg: 'Error getting all users'
    });
