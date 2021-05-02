import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { MemoryHistory } from 'history';
import { render, waitFor } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';
import React from 'react';
import ClientGrants from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientGrants';
import { ClientDetails } from '../../../../../../src/types/client';

jest.mock('../../../../../../src/services/ClientService', () => ({
    createClient: jest.fn(),
    deleteClient: jest.fn(),
    generateGuid: jest.fn(),
    getClientDetails: jest.fn(),
    updateClient: jest.fn()
}));

const [TestReduxProvider, storeHandler] = createTestReduxProvider({});

const firstGuid = 'ABCDEFG';
const secondGuid = 'HIJKLMNOP';
const stars = '**********';

const doRender = (history: MemoryHistory) =>
    waitFor(() =>
        render(
            <TestReduxProvider>
                <Router history={history}>
                    <Switch>
                        <Route path="/clients/:id/grants" component={ClientGrants} />
                    </Switch>
                </Router>
            </TestReduxProvider>
        )
    );

const existingClient: ClientDetails = {
    id: 1,
    name: 'Client',
    clientKey: 'Key',
    enabled: true,
    accessTokenTimeoutSecs: 100,
    refreshTokenTimeoutSecs: 200,
    authCodeTimeoutSecs: 300,
    redirectUris: ['https://www.google.com', 'https://www.facebook.com']
};

describe('ClientGrants', () => {
    describe('rendering', () => {
        it('renders with users', () => {
            throw new Error();
        });

        it('renders without users', () => {
            throw new Error();
        });
    });

    describe('behavior', () => {
        it('add a user', () => {
            throw new Error();
        });

        it('remove a user', () => {
            throw new Error();
        });

        it('add a role to a user', () => {
            throw new Error();
        });

        it('remove a role from a user', () => {
            throw new Error();
        });
    });
});