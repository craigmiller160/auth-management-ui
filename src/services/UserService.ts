import api from './Api';
import { UserList } from '../types/api';
import { Option } from 'fp-ts/es6/Option';

export const getUsers = (): Promise<Option<UserList>> =>
    api.get<UserList>({
        uri: '/users',
        errorMsg: 'Error getting all users'
    });
