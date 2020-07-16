import axios, { AxiosError } from 'axios';
import store from '../store';
import alertSlice from '../store/alert/slice';
import MessageBuilder from '../utils/MessageBuilder';

const instance = axios.create({
    baseURL: '/api'
});

type SuppressErrorFn = (ex: Error) => Boolean
interface ErrorResponse {
    status: number;
    data: {
        message: string;
    };
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
