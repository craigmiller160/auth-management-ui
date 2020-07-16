import api from './Api';

export const getClients = () => api.get({
    uri: '/clients',
    errorMsg: 'Error getting all clients'
});
