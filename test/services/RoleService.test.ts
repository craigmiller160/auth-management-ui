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
import {
  mockAndValidateGraphQL,
  mockCsrfPreflight
} from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';
import ajaxApi from '../../src/services/AjaxApi';
import { ClientRole } from '../../src/types/client';
import {
  CreateRoleWrapper,
  DeleteRoleWrapper,
  GraphQLQueryResponse,
  UpdateRoleWrapper
} from '../../src/types/graphApi';
import {
  createRole,
  deleteRole,
  updateRole
} from '../../src/services/RoleService';
import { Role } from '../../src/types/role';

const mockAjaxApi = new MockAdapter(ajaxApi.instance);

const role: ClientRole = {
  id: 1,
  name: 'The Role'
};
const clientId = 1;

describe('RoleService', () => {
  beforeEach(() => {
    mockAjaxApi.reset();
  });

  it('createRole', async () => {
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
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData
    });
    const result: Either<Error, Role> = await createRole(clientId, role)();
    expect(result).toEqualRight({
      ...role,
      clientId
    });
  });

  it('updateRole', async () => {
    const payload = `
                mutation {
                    updateRole(roleId: ${role.id}, role: {
                        name: "${role.name}",
                        clientId: ${clientId}
                    }) {
                        id
                        name
                        clientId
                    }
                }
            `;
    const responseData: GraphQLQueryResponse<UpdateRoleWrapper> = {
      data: {
        updateRole: {
          ...role,
          clientId
        }
      }
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData
    });
    const result: Either<Error, Role> = await updateRole(
      clientId,
      role.id,
      role
    )();
    expect(result).toEqualRight({
      ...role,
      clientId
    });
  });

  it('deleteRole', async () => {
    const payload = `
                mutation {
                    deleteRole(roleId: ${role.id}) {
                        id
                        name
                        clientId
                    }
                }
            `;
    const responseData: GraphQLQueryResponse<DeleteRoleWrapper> = {
      data: {
        deleteRole: {
          ...role,
          clientId
        }
      }
    };
    mockCsrfPreflight(mockAjaxApi, '/graphql');
    mockAndValidateGraphQL({
      mockApi: mockAjaxApi,
      payload,
      responseData
    });
    const result: Either<Error, Role> = await deleteRole(role.id)();
    expect(result).toEqualRight({
      ...role,
      clientId
    });
  });
});
