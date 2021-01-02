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
import { GraphQLQueryResponse } from '../../src/types/graphApi';

declare global {
    namespace jest {
        interface Matchers<R> {
            stringsToEqualIgnoreWhitespace(expected: string): CustomMatcherResult;
        }
    }
}

export const mockAndValidateGraphQL = <R>(
    mockApi: MockAdapter, uri: string, payload: string, responseData: GraphQLQueryResponse<R>
) =>
    mockApi.onPost(uri)
        .reply((config) => {
            expect(config.data).stringsToEqualIgnoreWhitespace(payload);
            return [
                200,
                responseData
            ];
        });