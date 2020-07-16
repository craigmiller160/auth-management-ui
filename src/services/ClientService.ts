import api from './Api';
import { ClientList } from '../types/api';

export const getClients = (): Promise<ClientList | undefined> => api.get<ClientList>({
    uri: '/clients',
    errorMsg: 'Error getting all clients'
});
