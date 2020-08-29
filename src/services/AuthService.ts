import api, { isAxiosError } from './Api';
import { AuthCodeLogin, AuthUser } from '../types/auth';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

export const logout = (): Promise<Either<Error, void>> =>
    api.get<void>({
        uri: '/oauth/logout',
        errorMsg: 'Error logging out'
    });

// TODO delete this
export const login = async (): Promise<Either<Error, AuthCodeLogin>> =>
    pipe(
        await api.post<void,AuthCodeLogin>({
            uri: '/oauth/authcode/login',
            errorMsg: 'Error getting login URL'
        }),
        map((login: AuthCodeLogin) => {
            window.location.href = login.url;
            return login;
        })
    );

export const getAuthUser = (): Promise<Either<Error, AuthUser>> =>
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
