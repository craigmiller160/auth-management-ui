import { ClientDetails, ClientRole, FullClientDetails } from './client';
import { Role } from './role';
import { FullUserDetails, UserDetails } from './user';

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

export interface UserDetailsWrapper {
    user: FullUserDetails;
}

export interface UpdateUserWrapper {
    updateUser: UserDetails;
}

export interface CreateUserWrapper {
    createUser: UserDetails;
}

export interface DeleteUserWrapper {
    deleteUser: UserDetails;
}
