import { ClientDetails, ClientRole, ClientUser, ClientWithRoles, FullClientDetails } from './client';
import { Role } from './role';
import { UserClient, UserClients, UserDetails, UserRole } from './user';

export interface GraphQLError {
    message: string;
}

export interface GraphQLQueryResponse<T> {
    data: T;
    errors: Array<GraphQLError>;
}

export interface OldClientDetailsWrapper {
    client: FullClientDetails;
}

export interface ClientDetailsWrapper {
    client: ClientDetails;
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
    user: UserDetails;
}

export interface UserClientsWrapper {
    user: UserClients
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

export interface RemoveUserFromClientWrapper {
    removeUserFromClient: Array<ClientUser>;
}

export interface AddUserToClientWrapper {
    addUserToClient: Array<ClientUser>;
}

export interface RemoveClientFromUserWrapper {
    removeClientFromUser: Array<UserClient>;
}

export interface AddClientToUserWrapper {
    addClientToUser: Array<UserClient>;
}

export interface RemoveRoleFromUserWrapper {
    removeRoleFromUser: Array<UserRole>;
}

export interface AddRoleToUserWrapper {
    addRoleToUser: Array<UserRole>;
}

export interface ClientRolesWrapper {
    client: ClientWithRoles;
}
