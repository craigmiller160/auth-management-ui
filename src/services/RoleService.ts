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

import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import api from './Api';
import ajaxApi from './AjaxApi';
import { ClientRole } from '../types/client';
import { Role } from '../types/role';
import { CreateRoleWrapper, DeleteRoleWrapper, UpdateRoleWrapper } from '../types/graphApi';
import * as TE from 'fp-ts/es6/TaskEither';
import { AxiosResponse } from 'axios';
import { GraphQLQueryResponse } from '@craigmiller160/ajax-api-fp-ts';

export const createRole = (clientId: number, role: ClientRole): TE.TaskEither<Error, Role> =>
    pipe(
        ajaxApi.graphql<CreateRoleWrapper>({
            payload:  `
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
        TE.map((res: AxiosResponse<GraphQLQueryResponse<CreateRoleWrapper>>) => res.data.data.createRole)
    );

export const updateRole = (clientId: number, roleId: number, role: ClientRole): TE.TaskEither<Error, Role> =>
    pipe(
        ajaxApi.graphql<UpdateRoleWrapper>({
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
        TE.map((res: AxiosResponse<GraphQLQueryResponse<UpdateRoleWrapper>>) => res.data.data.updateRole)
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
