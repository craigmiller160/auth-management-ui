import { Option } from 'fp-ts/es6/Option';
import api, { isAxiosError } from './Api';
import { AuthUser } from '../types/oldApi';

export const logout = (): Promise<Option<void>> =>
    api.get<void>({
        uri: '/oauth/logout',
        errorMsg: 'Error logging out'
    });

export const getAuthUser = (): Promise<Option<AuthUser>> =>
    api.get<AuthUser>({
        uri: '/oauth/user',
        errorMsg: 'Error getting authenticated user',
        suppressError: (ex: Error) => {
            if (isAxiosError(ex)) {
                return ex.response?.status === 401;
            }
            return false;
        }
    });
