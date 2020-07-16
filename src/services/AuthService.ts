import api, { isAxiosError } from './Api';
import { AuthUser } from '../types/api';

export const logout = (): Promise<void | undefined> =>
    api.get<void>({
        uri: '/oauth/logout',
        errorMsg: 'Error logging out'
    });

export const getAuthUser = (): Promise<AuthUser | undefined> =>
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
