import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import store from '../store';
import alertSlice from '../store/alert/slice';
import MessageBuilder from '../utils/MessageBuilder';

const instance = axios.create({
    baseURL: '/api'
});

type SuppressErrorFn = (ex: Error) => Boolean
interface ErrorResponse {
    status: number;
    message: string;
}
interface RequestConfig {
    uri: string;
    config: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn
}
interface RequestBodyConfig extends RequestConfig {
    body: any;
}

const isAxiosError = (ex: any): ex is AxiosError<ErrorResponse> => {
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

const get = async (req: RequestConfig): Promise<any> => {
    try {
        const res = await instance.get(req.uri, req.config);
        return res.data;
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return undefined;
    }
};

const post = async (req: RequestBodyConfig): Promise<any> => {
    try {
        const res = await instance.post(req.uri, req.body, req.config);
        return res.data;
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return undefined;
    }
};

const put = async (req: RequestBodyConfig): Promise<any> => {
    try {
        const res = await instance.put(req.uri, req.body, req.config);
        return res.data;
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return undefined;
    }
};

const doDelete = async (req: RequestConfig): Promise<any> => {
    try {
        const res = await instance.delete(req.uri, req.config);
        return res.data;
    } catch (ex) {
        handleError(ex, req.errorMsg, req.suppressError);
        return undefined;
    }
};

export default {
    get,
    put,
    post,
    delete: doDelete
};
