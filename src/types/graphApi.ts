import { ClientDetails, ClientRole, FullClientDetails } from './client';
import { Role } from './role';

export interface GraphQLError {
    message: string;
}

export interface GraphQLQueryResponse<T> {
    data: T;
    errors: Array<GraphQLError>;
}

export interface ClientDetailsWrapper {
    client: FullClientDetails
}

export interface RolesForClientWrapper {
    rolesForClient: Array<ClientRole>;
}

export interface UpdateClientWrapper {
    updateClient: ClientDetails;
}

export interface CreateClientWrapper {
    createClient: ClientDetails;
}

export interface DeleteClientWrapper {
    deleteClient: ClientDetails;
}

export interface CreateRoleWrapper {
    createRole: Role;
}

export interface UpdateRoleWrapper {
    updateRole: Role;
}

export interface DeleteRoleWrapper {
    deleteRole: Role;
}
