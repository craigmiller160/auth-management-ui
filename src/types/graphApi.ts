/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ClientDetails, ClientUser, ClientWithRoles, FullClientDetails } from './client';
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
