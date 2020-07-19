import api from './Api';
import { Client, ClientList, FullClient, Role } from '../types/api';
import { Option } from 'fp-ts/es6/Option';

export const getClients = (): Promise<Option<ClientList>> =>
    api.get<ClientList>({
        uri: '/clients',
        errorMsg: 'Error getting all clients'
    });

export const getClient = (id: number): Promise<Option<FullClient>> =>
    api.get<FullClient>({
        uri: `/clients/${id}`,
        errorMsg: `Error getting client ${id}`
    });

export const generateGuid = (): Promise<Option<string>> =>
    api.get<string>({
        uri: '/clients/guid',
        errorMsg: 'Error generating GUID'
    });

export const updateClient = (id: number, client: Client): Promise<Option<Client>> =>
    api.put<Client,Client>({
        uri: `/clients/${id}`,
        body: client,
        errorMsg: `Error updating client ${id}`
    });

export const createClient = (client: Client): Promise<Option<Client>> =>
    api.post<Client,Client>({
        uri: '/clients',
        body: client,
        errorMsg: 'Error creating client'
    });

export const deleteClient = (id: number): Promise<Option<Client>> =>
    api.delete<Client>({
        uri: `/clients/${id}`,
        errorMsg: `Error deleting client ${id}`
    });

export const createRole = (clientId: number, role: Role): Promise<Option<Role>> =>
    api.post<Role,Role>({
        uri: `/clients/${clientId}/roles`,
        body: role,
        errorMsg: `Error creating role for client ${clientId}`
    });

export const updateRole = (clientId: number, roleId: number, role: Role): Promise<Option<Role>> =>
    api.put<Role,Role>({
        uri: `/clients/${clientId}/roles/${roleId}`,
        body: role,
        errorMsg: `Error updating role ${roleId} for client ${clientId}`
    });

export const deleteRole = (clientId: number, roleId: number): Promise<Option<Role>> =>
    api.delete<Role>({
        uri: `/clients/${clientId}/roles/${roleId}`,
        errorMsg: `Error deleting role ${roleId} for client ${clientId}`
    });
