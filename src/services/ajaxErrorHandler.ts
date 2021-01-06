import { DefaultErrorHandler } from '@craigmiller160/ajax-api-fp-ts/';
import { showErrorReduxAlert } from '@craigmiller160/react-material-ui-common';
import { AxiosError, AxiosResponse } from 'axios';
import { none } from 'fp-ts/es6/Option';
import MessageBuilder from '../utils/MessageBuilder';
import store from '../store';
import { ErrorResponse } from '../types/api';
import authSlice from '../store/auth/slice';

const isErrorResponse = (data?: any): data is ErrorResponse =>
    data?.status !== undefined && data?.message !== undefined;

const getFullErrorResponseMessage = (errorMsg: string, response: AxiosResponse) => {
    const { status } = response;
    if (isErrorResponse(response.data)) {
        const { message } = response.data;
        return new MessageBuilder(errorMsg)
            .append(`Status: ${status}`)
            .append(`Message: ${message}`)
            .message;
    }
    return new MessageBuilder(errorMsg)
        .append(`Status: ${status}`)
        .append(`Message: ${JSON.stringify(response.data)}`)
        .message;
};

const getFullErrorMessage = (errorMsg: string, error: Error) =>
    new MessageBuilder(errorMsg)
        .append(`Message: ${error.message}`)
        .message;

// TODO write tests
const ajaxErrorHandler: DefaultErrorHandler = (status: number, error: Error, requestMessage?: string): void => {
    if (status > 0 && (error as AxiosError).response) {
        const response: AxiosResponse = (error as AxiosError).response!!;
        const fullMessage = getFullErrorResponseMessage(requestMessage ?? '', response);
        store.dispatch(showErrorReduxAlert(fullMessage));

        if (status === 401) {
            store.dispatch(authSlice.actions.setUserData(none));
        }
    } else {
        const fullMessage = getFullErrorMessage(requestMessage ?? '', error);
        store.dispatch(showErrorReduxAlert(fullMessage));
    }
};

export default ajaxErrorHandler;
