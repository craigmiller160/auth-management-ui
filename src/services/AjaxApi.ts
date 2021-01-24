import { createApi } from '@craigmiller160/ajax-api-fp-ts';
import ajaxErrorHandler from './ajaxErrorHandler';

export default createApi({
    baseURL: '/auth-manage-ui/api',
    useCsrf: true,
    defaultErrorHandler: ajaxErrorHandler
});
