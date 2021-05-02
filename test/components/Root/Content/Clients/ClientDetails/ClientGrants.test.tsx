import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import { render, waitFor, screen } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';
import React from 'react';
import ClientGrants from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientGrants';
import { ClientDetails, FullClientDetails } from '../../../../../../src/types/client';

jest.mock('../../../../../../src/services/ClientService', () => ({
    getFullClientDetails: jest.fn()
}));

jest.mock('../../../../../../src/services/UserService', () => ({
    getAllUsers: jest.fn()
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

const client: FullClientDetails = {
    id: 1,
    name: 'Client',
    clientKey: 'Key',
    enabled: true,
    accessTokenTimeoutSecs: 100,
    refreshTokenTimeoutSecs: 200,
    authCodeTimeoutSecs: 300,
    redirectUris: ['https://www.google.com', 'https://www.facebook.com'],
    roles: [],
    users: []
};

describe('ClientGrants', () => {
    let testHistory: MemoryHistory;
    beforeEach(() => {
        jest.resetAllMocks();
        testHistory = createMemoryHistory();
        testHistory.push('/clients/1/grants');
    });

    describe('rendering', () => {
        it('renders with users', async () => {
            await doRender(testHistory);

            screen.debug(); // TODO delete this
        });

        it('renders without users', async () => {
            throw new Error();
        });
    });

    describe('behavior', () => {
        it('add a user', async () => {
            throw new Error();
        });

        it('remove a user', async () => {
            throw new Error();
        });

        it('add a role to a user', async () => {
            throw new Error();
        });

        it('remove a role from a user', async () => {
            throw new Error();
        });
    });
});