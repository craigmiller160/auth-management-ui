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
import { instance } from '../../src/services/Api';
import { ClientRole } from '../../src/types/client';
import { CreateRoleWrapper, GraphQLQueryResponse } from '../../src/types/graphApi';
import { createRole } from '../../src/services/RoleService';
import '../jest.d.ts';
import { Either } from 'fp-ts/es6/Either';
import { Role } from '../../src/types/role';

declare global {
    namespace jest {
        interface Matchers<R> {
            stringsToEqualIgnoreWhitespace(expected: string): CustomMatcherResult;
        }
    }
}

const mockApi = new MockAdapter(instance);

const mockPreflight = () =>
    mockApi.onOptions('/graphql')
        .reply((config) => {
            expect(config.headers['x-csrf-token']).toEqual('fetch');
            return [
                200,
                null,
                {
                    ['x-csrf-token']: 'ABCDEFG'
                }
            ];
        });

// TODO move this to library
expect.extend({
    stringsToEqualIgnoreWhitespace(received: string, expected: string) {
        const receivedNoWhitespace = received.trim().replace(/\s/g, '');
        const expectedNoWhitespace = expected.trim().replace(/\s/g, '');
        const pass = receivedNoWhitespace === expectedNoWhitespace;
        if (pass) {
            return {
                message: () => '',
                pass: true
            };
        } else {
            return {
                message: () => 'Expected strings to be equal if ignoring whitespace',
                pass: false
            };
        }
    }
});

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
        mockPreflight();
        mockApi.onPost('/graphql')
            .reply((config) => {
                expect(config.data.trim()).stringsToEqualIgnoreWhitespace(payload.trim());
                return [
                    200,
                    responseData
                ];
            });
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