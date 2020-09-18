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

import api from './Api';
import { ClientRole } from '../types/client';
import { Role } from '../types/role';
import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { CreateRoleWrapper, DeleteRoleWrapper, UpdateRoleWrapper } from '../types/graphApi';

export const createRole = async (clientId: number, role: ClientRole): Promise<Either<Error, Role>> =>
    pipe(
        await api.graphql<CreateRoleWrapper>({
            payload: `
                mutation {
                    createRole(role: {
                        name: "${role.name}",
                        clientId: ${clientId}
                    }) {
                        id
                        name
                        clientId
                    }
                }
            `,
            errorMsg: `Error creating role for client ${clientId}`
        }),
        map((wrapper: CreateRoleWrapper) => wrapper.createRole)
    );

export const updateRole = async (clientId: number, roleId: number, role: ClientRole): Promise<Either<Error, Role>> =>
    pipe(
        await api.graphql<UpdateRoleWrapper>({
            payload: `
                mutation {
                    updateRole(roleId: ${roleId}, role: {
                        name: "${role.name}",
                        clientId: ${clientId}
                    }) {
                        id
                        name
                        clientId
                    }
                }
            `,
            errorMsg: `Error updating role ${roleId} for client ${clientId}`
        }),
        map((wrapper: UpdateRoleWrapper) => wrapper.updateRole)
    );

export const deleteRole = async (roleId: number): Promise<Either<Error, Role>> =>
    pipe(
        await api.graphql<DeleteRoleWrapper>({
            payload: `
                mutation {
                    deleteRole(roleId: ${roleId}) {
                        id
                        name
                        clientId
                    }
                }
            `,
            errorMsg: `Error deleting role ${roleId}`
        }),
        map((wrapper: DeleteRoleWrapper) => wrapper.deleteRole)
    );
