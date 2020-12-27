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

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { map, none } from 'fp-ts/es6/Option';
import { Either, left, right } from 'fp-ts/es6/Either';
import { showErrorReduxAlert } from '@craigmiller160/react-material-ui-common';
import store from '../store';
import authSlice from '../store/auth/slice';
import MessageBuilder from '../utils/MessageBuilder';
import { ErrorResponse } from '../types/api';
import { GraphQLQueryResponse } from '../types/graphApi';
import { pipe } from 'fp-ts/es6/pipeable';

const instance: AxiosInstance = axios.create({
    baseURL: '/auth-manage-ui/api',
    withCredentials: true
});

export type SuppressErrorFn = (ex: Error) => Boolean;

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
}
export interface RequestBodyConfig<B> extends RequestConfig {
    body?: B;
}

export interface GraphQLRequest {
    payload: string;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
    config?: AxiosRequestConfig;
}

const addCsrfTokenInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const { csrfToken } = store.getState().auth;
    pipe(
        csrfToken,
        map((token) => {
            config.headers = {
                ...config.headers,
                'x-csrf-token': token
            };
        })
    );
    return config;
};
instance.interceptors.request.use(addCsrfTokenInterceptor);

export const isAxiosError = (ex: any): ex is AxiosError<ErrorResponse> => ex.response !== undefined;

const getFullMessage = (errorMsg: string, ex: Error): string => {
    if (isAxiosError(ex) && ex.response) {
        const { status, data: { message } } = ex.response;
        return new MessageBuilder(errorMsg)
            .append(status ? `Status: ${status}` : '')
            .append(message ? `Message: ${message}` : '')
            .message;
    }
    return new MessageBuilder(errorMsg)
        .append(ex.message)
        .message;
};

const handle401Error = (ex: Error) => {
    if (isAxiosError(ex) && ex.response?.status === 401) {
        store.dispatch(authSlice.actions.setUserData(none));
    }
};

const handleError = (ex: Error, errorMsg: string = '', suppressError: SuppressErrorFn = (e) => false) => {
    if (!suppressError(ex)) {
        const fullMessage = getFullMessage(errorMsg, ex);
        console.log(fullMessage, ex); // eslint-disable-line no-console
        store.dispatch(showErrorReduxAlert(fullMessage));
    }
    handle401Error(ex);
};

const getGraphQLErrorMessage = <R> (data: GraphQLQueryResponse<R>): string =>
    data.errors
        ?.map((error) => error.message)
        ?.join('\n') ??
        '';

const get = async <R>(req: RequestConfig): Promise<Either<Error, R>> => {
    try {
        const res = await instance.get<R>(req.uri, req.config);
        return right(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return left(ex);
    }
};

const post = async <B, R>(req: RequestBodyConfig<B>): Promise<Either<Error, R>> => {
    try {
        const res = await instance.post<R>(req.uri, req.body, req.config);
        return right(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return left(ex);
    }
};

const graphql = async <R>(req: GraphQLRequest): Promise<Either<Error, R>> => {
    try {
        const config: AxiosRequestConfig = {
            ...(req.config ?? {}),
            headers: {
                ...(req.config?.headers ?? {}),
                'Content-Type': 'application/graphql'
            }
        };
        const res = await instance.post<GraphQLQueryResponse<R>>('/graphql', req.payload, config);
        const { data } = res;
        if (data.errors) {
            const message = getGraphQLErrorMessage(data);
            const error = new Error(message);
            handleError(error, req.errorMsg, req.suppressError);
            return left(error);
        } 
            return right(data.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return left(ex);
    }
};

const put = async <B, R>(req: RequestBodyConfig<B>): Promise<Either<Error, R>> => {
    try {
        const res = await instance.put<R>(req.uri, req.body, req.config);
        return right(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return left(ex);
    }
};

const doDelete = async <R>(req: RequestConfig): Promise<Either<Error, R>> => {
    try {
        const res = await instance.delete<R>(req.uri, req.config);
        return right(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return left(ex);
    }
};

export default {
    get,
    put,
    post,
    graphql,
    delete: doDelete
};
