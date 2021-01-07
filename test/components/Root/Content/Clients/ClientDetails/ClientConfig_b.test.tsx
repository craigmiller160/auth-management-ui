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

import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockAdapter from 'axios-mock-adapter';
import ajaxApi from '../../../../../../src/services/AjaxApi';
import { createMemoryHistory, MemoryHistory } from 'history';
import { mockCsrfPreflight } from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';
import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { Route, Router, Switch } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';

const mockApi = new MockAdapter(ajaxApi.instance);
const [ TestReduxProvider, store ] = createTestReduxProvider({});

const firstGuid = 'ABCDEFG';
const secondGuid = 'HIJKLMNOP';
const stars = '**********';

describe('ClientConfig', () => {
    let testHistory: MemoryHistory;
    beforeEach(() => {
        mockApi.reset();
        mockCsrfPreflight(mockApi, '/graphql');
        mockApi.onGet('/clients/guid')
            .replyOnce(200, firstGuid);
        mockApi.onGet('/clients/guid')
            .replyOnce(200, secondGuid);
        testHistory = createMemoryHistory();
    });

    describe('rendering',  () => {
        it('renders for new client', async () => {
            testHistory.push('/clients/new');
            await waitFor(() => render(
                <TestReduxProvider>
                    <Router history={ testHistory }>
                        <Switch>
                            <Route
                                path="/clients/:id"
                                component={ ClientConfig }
                            />
                        </Switch>
                    </Router>
                </TestReduxProvider>
            ));

            expect(screen.getByLabelText('Client Name'))
                .toHaveValue('New Client');
            expect(screen.getByLabelText('Client Key'))
                .toHaveValue(firstGuid);
            expect(screen.getByLabelText('Client Secret'))
                .toHaveValue(secondGuid);
            expect(screen.getAllByText('Generate'))
                .toHaveLength(2);
            expect(screen.getByLabelText('Enabled'))
                .toBeChecked();
            expect(screen.getByLabelText('Access Token Timeout (Secs)'))
                .toHaveValue(300);
            expect(screen.getByLabelText('Refresh Token Timeout (Secs)'))
                .toHaveValue(3600);
            expect(screen.getByLabelText('Auth Code Timeout (Secs)'))
                .toHaveValue(60);

            expect(screen.getByText('Add Redirect URI'))
                .toBeTruthy();
            expect(screen.getByText('Save'))
                .toBeTruthy();
            expect(screen.queryByText('Delete'))
                .toBeNull();
        });
    });

    describe('behavior', () => {
        it('fills out form', () => {
            throw new Error();
        });
    });
});