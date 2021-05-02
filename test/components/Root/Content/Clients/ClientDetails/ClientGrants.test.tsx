import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import { render, waitFor, screen } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';
import React from 'react';
import ClientGrants from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientGrants';
import {
	ClientDetails,
	FullClientDetails
} from '../../../../../../src/types/client';
import { getFullClientDetails } from '../../../../../../src/services/ClientService';
import * as TE from 'fp-ts/es6/TaskEither';
import { getAllUsers } from '../../../../../../src/services/UserService';
import { UserDetails, UserList } from '../../../../../../src/types/user';

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
						<Route
							path="/clients/:id/grants"
							component={ClientGrants}
						/>
					</Switch>
				</Router>
			</TestReduxProvider>
		)
	);

const client: FullClientDetails = {
	id: 1,
	name: 'Client Name',
	clientKey: 'Key',
	enabled: true,
	accessTokenTimeoutSecs: 100,
	refreshTokenTimeoutSecs: 200,
	authCodeTimeoutSecs: 300,
	redirectUris: ['https://www.google.com', 'https://www.facebook.com'],
	roles: [],
	users: []
};

const userList: UserList = {
	users: []
};

const mockGetFullClientDetails = () =>
    (getFullClientDetails as jest.Mock).mockImplementation(() => TE.right(client));

const mockGetAllUsers = () =>
	(getAllUsers as jest.Mock).mockImplementation(() => TE.right(userList));

describe('ClientGrants', () => {
	let testHistory: MemoryHistory;
	beforeEach(() => {
		jest.resetAllMocks();
		testHistory = createMemoryHistory();
		testHistory.push('/clients/1/grants');

		mockGetFullClientDetails();
		mockGetAllUsers();
	});

	describe('rendering', () => {
		it('renders with users', async () => {
			await doRender(testHistory);

			screen.debug(); // TODO delete this
            expect(screen.queryByText('Client Name'))
                .toBeInTheDocument();
            // TODO finish the test
            // TODO don't forget validating the API functions
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
