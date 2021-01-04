import { createApi } from '@craigmiller160/ajax-api-fp-ts';

export default createApi({
    baseURL: '/auth-manage-ui/api',
    useCsrf: true
});
