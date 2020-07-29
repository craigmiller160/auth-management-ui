import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { none, Option, some } from 'fp-ts/es6/Option';
import store from '../store';
import alertSlice from '../store/alert/slice';
import authSlice from '../store/auth/slice';
import MessageBuilder from '../utils/MessageBuilder';
import { ErrorResponse } from '../types/api';
import { Either, left, right } from 'fp-ts/es6/Either';
import { GraphQLQueryResponse } from '../types/graphApi';

const instance = axios.create({
    baseURL: '/api'
});

export type SuppressErrorFn = (ex: Error) => Boolean

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn
}
export interface RequestBodyConfig<B> extends RequestConfig {
    body: B;
}

export interface GraphQLRequest {
    payload: string;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
    config?: AxiosRequestConfig;
}

export const isAxiosError = (ex: any): ex is AxiosError<ErrorResponse> => {
    return ex.response !== undefined;
};

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
        console.log(fullMessage, ex);
        store.dispatch(alertSlice.actions.showErrorAlert(fullMessage));
    }
    handle401Error(ex);
};

const getGraphQLErrorMessage = <R> (data: GraphQLQueryResponse<R>): string => {
    return data.errors
        ?.map((error) => error.message)
        ?.join('\n')
        ?? '';
}

const get = async <R>(req: RequestConfig): Promise<Option<R>> => {
    try {
        const res = await instance.get(req.uri, req.config);
        return some(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return none;
    }
};

const post = async <B,R>(req: RequestBodyConfig<B>): Promise<Option<R>> => {
    try {
        const res = await instance.post(req.uri, req.body, req.config);
        return some(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return none;
    }
};

const post2 = async <B,R>(req: RequestBodyConfig<B>): Promise<Either<Error, R>> => { // TODO delete this
    try {
        const res = await instance.post(req.uri, req.body, req.config);
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
        const data: GraphQLQueryResponse<R> = res.data;
        if (data.errors) {
            const message = getGraphQLErrorMessage(data);
            const error = new Error(message);
            handleError(error, req.errorMsg, req.suppressError);
            return left(error);
        } else {
            return right(data.data);
        }
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return left(ex);
    }
};

const put = async <B,R>(req: RequestBodyConfig<B>): Promise<Option<R>> => {
    try {
        const res = await instance.put(req.uri, req.body, req.config);
        return some(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return none;
    }
};

const doDelete = async <R>(req: RequestConfig): Promise<Option<R>> => {
    try {
        const res = await instance.delete(req.uri, req.config);
        return some(res.data);
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return none;
    }
};

export default {
    get,
    put,
    post,
    post2,
    graphql,
    delete: doDelete
};
