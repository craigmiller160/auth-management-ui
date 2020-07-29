import api from './Api';
import graphApi from './GraphApi';
import { Client, FullClient, Role, RoleList } from '../types/api';
import { Option } from 'fp-ts/es6/Option';
import { ClientListResponse } from '../types/graphApi';
import { Either } from 'fp-ts/es6/Either';

export const getAllClients = (): Promise<Either<Error,ClientListResponse>> =>
    graphApi.graphql<ClientListResponse>({
        payload: `
            query {
                clients {
                    id
                    name
                    clientKey
                }
            }
        `,
        errorMsg: 'Error getting all clients'
    });

export const getClient = (id: number): Promise<Option<FullClient>> =>
    api.get<FullClient>({
        uri: `/clients/${id}`,
        errorMsg: `Error getting client ${id}`
    });

// TODO refactor this at the end to use Either
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

export const getRoles = (clientId: number): Promise<Option<RoleList>> =>
    api.get<RoleList>({
        uri: `/clients/${clientId}/roles`,
        errorMsg: `Error getting roles for client ${clientId}`
    });
