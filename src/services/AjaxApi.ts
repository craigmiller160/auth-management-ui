import { createApi } from '@craigmiller160/ajax-api-fp-ts';
import createAjaxErrorHandler from '@craigmiller160/ajax-error-handler';
import { AxiosResponse } from 'axios';
import { ErrorResponse } from '../types/api';
import store from '../store';
import { showErrorReduxAlert } from '@craigmiller160/react-material-ui-common';
import authSlice from '../store/auth/slice';
import { none } from 'fp-ts/es6/Option';

interface MaybeErrorResponse {
	status?: number;
	message?: string;
}

const isErrorResponse = (data?: MaybeErrorResponse): data is ErrorResponse =>
	data?.status !== undefined && data?.message !== undefined;

const ajaxErrorHandler = createAjaxErrorHandler({
	responseMessageExtractor: (response: AxiosResponse) => {
		if (isErrorResponse(response.data)) {
			return response.data.message;
		}
		return '';
	},
	errorMessageHandler: (message: string) =>
		store.dispatch(showErrorReduxAlert(message)),
	unauthorizedHandler: () =>
		store.dispatch(authSlice.actions.setUserData(none))
});

export default createApi({
	baseURL: '/auth-management/api',
	useCsrf: true,
	defaultErrorHandler: ajaxErrorHandler
});
