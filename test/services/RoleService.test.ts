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

import MockAdapter from 'axios-mock-adapter';
import { Either } from 'fp-ts/es6/Either';
import { instance } from '../../src/services/Api';
import { ClientRole } from '../../src/types/client';
import { CreateRoleWrapper, GraphQLQueryResponse } from '../../src/types/graphApi';
import { createRole } from '../../src/services/RoleService';
import { Role } from '../../src/types/role';
import { mockCsrfPreflight } from './mockCsrf';
import { mockAndValidateGraphQL } from './mockAndValidateGraphQL';

const mockApi = new MockAdapter(instance);

describe('RoleService', () => {
    beforeEach(() => {
        mockApi.reset();
    });

    it('createRole', async () => {
        const role: ClientRole = {
            id: 0,
            name: 'The Role'
        };
        const clientId = 1;
        const payload = `
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
        `;
        const responseData: GraphQLQueryResponse<CreateRoleWrapper> = {
            data: {
                createRole: {
                    ...role,
                    clientId
                }
            }
        };
        mockCsrfPreflight(mockApi);
        mockAndValidateGraphQL(mockApi, '/graphql', payload, responseData);
        const result: Either<Error, Role> = await createRole(clientId, role);
        expect(result).toEqual({
            _tag: 'Right',
            right: {
                ...role,
                clientId
            }
        });
    });

    it('updateRole', () => {
        throw new Error();
    });

    it('deleteRole', () => {
        throw new Error();
    });
});
