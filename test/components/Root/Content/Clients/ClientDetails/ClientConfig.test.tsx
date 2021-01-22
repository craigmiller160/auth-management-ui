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
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { Route, Router, Switch } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';
import { ClientDetails } from '../../../../../../src/types/client';
import {
    createClient,
    generateGuid,
    getClientDetails,
    updateClient,
    deleteClient
} from '../../../../../../src/services/ClientService';
import * as TE from 'fp-ts/es6/TaskEither';

jest.mock('../../../../../../src/services/ClientService', () => ({
    createClient: jest.fn(),
    deleteClient: jest.fn(),
    generateGuid: jest.fn(),
    getClientDetails: jest.fn(),
    updateClient: jest.fn()
}));

const [ TestReduxProvider, storeHandler ] = createTestReduxProvider({});

const firstGuid = 'ABCDEFG';
const secondGuid = 'HIJKLMNOP';
const stars = '**********';

const doRender = (history: MemoryHistory) => waitFor(() => render(
    <TestReduxProvider>
        <Router history={ history }>
            <Switch>
                <Route
                    path="/clients/:id"
                    component={ ClientConfig }
                />
            </Switch>
        </Router>
    </TestReduxProvider>
));

const existingClient: ClientDetails = {
    id: 1,
    name: 'Client',
    clientKey: 'Key',
    enabled: true,
    accessTokenTimeoutSecs: 100,
    refreshTokenTimeoutSecs: 200,
    authCodeTimeoutSecs: 300,
    redirectUris: [
        'https://www.google.com'
    ]
};

const mockGetClient = () =>
    (getClientDetails as jest.Mock).mockImplementation(() => TE.right({
        ...existingClient,
        redirectUris: [
            ...existingClient.redirectUris
        ]
    }));

describe('ClientConfig', () => {
    let testHistory: MemoryHistory;
    beforeEach(() => {
        jest.resetAllMocks();
        (generateGuid as jest.Mock).mockImplementationOnce(() => TE.right(firstGuid));
        (generateGuid as jest.Mock).mockImplementationOnce(() => TE.right(secondGuid));
        testHistory = createMemoryHistory();
    });

    describe('rendering',  () => {
        it('renders for new client', async () => {
            testHistory.push('/clients/new');
            await doRender(testHistory);

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
                .toBeInTheDocument();
            expect(screen.getByText('Save'))
                .toBeInTheDocument();
            expect(screen.queryByText('Delete'))
                .not.toBeInTheDocument();
        });

        it('renders for existing client', async () => {
            mockGetClient();
            testHistory.push('/clients/1');
            await doRender(testHistory);

            expect(screen.getByLabelText('Client Name'))
                .toHaveValue('Client');
            expect(screen.getByLabelText('Client Key'))
                .toHaveValue('Key');
            expect(screen.getByLabelText('Client Secret'))
                .toHaveValue(stars);
            expect(screen.getAllByText('Generate'))
                .toHaveLength(2);
            expect(screen.getByLabelText('Enabled'))
                .toBeChecked();
            expect(screen.getByLabelText('Access Token Timeout (Secs)'))
                .toHaveValue(100);
            expect(screen.getByLabelText('Refresh Token Timeout (Secs)'))
                .toHaveValue(200);
            expect(screen.getByLabelText('Auth Code Timeout (Secs)'))
                .toHaveValue(300);

            expect(screen.getByText('https://www.google.com'))
                .toBeInTheDocument();

            expect(screen.getByText('Add Redirect URI'))
                .toBeInTheDocument();
            expect(screen.getByText('Save'))
                .toBeInTheDocument();
            expect(screen.queryByText('Delete'))
                .toBeInTheDocument();
        });
    });

    describe('behavior', () => {
        it('fills out editable fields', async () => {
            // TODO figure out act warning here
            testHistory.push('/clients/new');
            await doRender(testHistory);

            const clientName = screen.getByLabelText('Client Name');
            userEvent.clear(clientName);
            userEvent.type(clientName, 'Another Client');
            expect(clientName)
                .toHaveValue('Another Client');

            const accessToken = screen.getByLabelText('Access Token Timeout (Secs)');
            userEvent.clear(accessToken);
            userEvent.type(accessToken, '1');
            expect(accessToken)
                .toHaveValue(1);

            const refreshToken = screen.getByLabelText('Refresh Token Timeout (Secs)');
            userEvent.clear(refreshToken);
            userEvent.type(refreshToken, '2');
            expect(refreshToken)
                .toHaveValue(2);

            const authCode = screen.getByLabelText('Auth Code Timeout (Secs)');
            userEvent.clear(authCode);
            userEvent.type(authCode, '3');
            expect(authCode)
                .toHaveValue(3);

            const enabled = screen.getByLabelText('Enabled');
            userEvent.click(enabled);
            expect(enabled)
                .not.toBeChecked();
        });

        it('save new client', async () => {
            mockGetClient();
            (createClient as jest.Mock).mockImplementation(() => TE.of(existingClient));
            testHistory.push('/clients/new');
            await doRender(testHistory);

            await waitFor(() => userEvent.click(screen.getByText('Save')));

            expect(createClient).toHaveBeenCalledWith({
                name: 'New Client',
                clientKey: firstGuid,
                clientSecret: secondGuid,
                enabled: true,
                accessTokenTimeoutSecs: 300,
                refreshTokenTimeoutSecs: 3600,
                authCodeTimeoutSecs: 60,
                redirectUris: []
            });

            expect(testHistory.location.pathname).toEqual('/clients/1');
            expect(storeHandler.store?.getActions()).toEqual([
                {
                    type: 'alert/showSuccessAlert',
                    payload: 'Successfully saved client new'
                }
            ]);
        });

        it('save existing client', async () => {
            mockGetClient();
            (updateClient as jest.Mock).mockImplementation(() => TE.right(existingClient));
            testHistory.push('/clients/1');
            await doRender(testHistory);

            await waitFor(() => userEvent.click(screen.getByText('Save')));

            expect(updateClient).toHaveBeenCalledWith(1, {
                ...existingClient,
                id: undefined,
                clientSecret: ''
            });
            expect(testHistory.location.pathname).toEqual('/clients/1');
            expect(storeHandler.store?.getActions()).toEqual([
                {
                    type: 'alert/showSuccessAlert',
                    payload: 'Successfully saved client 1'
                }
            ]);
        });

        it('deletes client', async () => {
            mockGetClient();
            (deleteClient as jest.Mock).mockImplementation(() => TE.right(existingClient));
            testHistory.push('/clients/1');
            await doRender(testHistory);

            await waitFor(() => userEvent.click(screen.getByText('Delete')));

            expect(screen.getByText('Delete Client')).toBeInTheDocument();
            expect(screen.getByText('Are you sure you want to delete this client?')).toBeInTheDocument();
            await waitFor(() => userEvent.click(screen.getByText('Confirm')));

            expect(testHistory.location.pathname).toEqual('/clients');
            expect(storeHandler.store?.getActions()).toEqual([
                {
                    type: 'alert/showSuccessAlert',
                    payload: 'Successfully deleted client 1'
                }
            ]);
        });

        it('cancels deleting client', () => {
            throw new Error();
        })

        it('adds redirect uri', () => {
            // expect(screen.queryByText("Redirect URI"))
            //     .not.toBeInTheDocument();
            // fireEvent.click(screen.getByText("Add Redirect URI"));
            // expect(screen.getByText("Redirect URI"))
            //     .toBeInTheDocument();
            throw new Error();
        });

        it('cancels adding redirect uri', () => {
            throw new Error();
        });

        it('edits redirect uri', () => {
            throw new Error();
        });

        it('deletes redirect uri', () => {
            throw new Error();
        });

        it('generate client key', async () => {
            mockGetClient();
            testHistory.push('/clients/1');
            await doRender(testHistory);
            screen.debug(); // TODO delete this

            const generate = screen.getAllByText('Generate')[0];
            await waitFor(() => userEvent.click(generate));
            expect(screen.getByLabelText('Client Key'))
                .toHaveValue(firstGuid);
        });

        it('generate client secret', async () => {
            mockGetClient();
            testHistory.push('/clients/1');
            await doRender(testHistory);

            const generate = screen.getAllByText('Generate')[1];
            await waitFor(() => userEvent.click(generate));
            expect(screen.getByLabelText('Client Secret'))
                .toHaveValue(firstGuid);
        });
    });
});