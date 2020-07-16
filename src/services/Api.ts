import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Option, none, some } from 'fp-ts/es6/Option';
import store from '../store';
import alertSlice from '../store/alert/slice';
import MessageBuilder from '../utils/MessageBuilder';
import { ErrorResponse } from '../types/api';

const instance = axios.create({
    baseURL: '/api'
});

type SuppressErrorFn = (ex: Error) => Boolean

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn
}
export interface RequestBodyConfig<B> extends RequestConfig {
    body: B;
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

const handleError = (ex: Error, errorMsg: string = '', suppressError: SuppressErrorFn = (e) => false) => {
    if (!suppressError(ex)) {
        const fullMessage = getFullMessage(errorMsg, ex);
        console.log(fullMessage, ex);
        store.dispatch(alertSlice.actions.showErrorAlert(fullMessage));
    }
};

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
    delete: doDelete
};
