import api from './Api';
import { Client, ClientList } from '../types/api';

export const getClients = (): Promise<ClientList | undefined> =>
    api.get<ClientList>({
        uri: '/clients',
        errorMsg: 'Error getting all clients'
    });

export const getClient = (id: number): Promise<Client | undefined> =>
    api.get<Client>({
        uri: `/clients/${id}`,
        errorMsg: `Error getting client ${id}`
    });

export const generateGuid = (): Promise<string | undefined> =>
    api.get<string>({
        uri: '/clients/guid',
        errorMsg: 'Error generating GUID'
    });

export const updateClient = (id: string, client: Client): Promise<Client | undefined> =>
    api.put<Client,Client>({
        uri: `/clients/${id}`,
        body: client,
        errorMsg: `Error updating client ${id}`
    });

export const createClient = (client: Client): Promise<Client | undefined> =>
    api.post<Client,Client>({
        uri: '/clients',
        body: client,
        errorMsg: 'Error creating client'
    });

export const deleteClient = (id: number): Promise<Client | undefined> =>
    api.delete<Client>({
        uri: `'/clients/${id}`,
        errorMsg: `Error deleting client ${id}`
    });