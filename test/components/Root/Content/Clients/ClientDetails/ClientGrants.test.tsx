import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import { render, waitFor, screen } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';
import React from 'react';
import ClientGrants from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientGrants';
import {
	ClientDetails, ClientUser,
	FullClientDetails
} from '../../../../../../src/types/client';
import { getFullClientDetails } from '../../../../../../src/services/ClientService';
import * as TE from 'fp-ts/es6/TaskEither';
import { getAllUsers } from '../../../../../../src/services/UserService';
import { UserClient, UserDetails, UserList } from '../../../../../../src/types/user';

jest.mock('../../../../../../src/services/ClientService', () => ({
	getFullClientDetails: jest.fn()
}));

jest.mock('../../../../../../src/services/UserService', () => ({
	getAllUsers: jest.fn()
}));

const [TestReduxProvider, storeHandler] = createTestReduxProvider({});

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

const user1: UserDetails = {
	id: 1,
	email: 'user1@gmail.com',
	firstName: 'user1-first',
	lastName: 'user1-last',
	enabled: true
};

const clientUser1: ClientUser = {
	...user1,
	roles: []
};

const user2: UserDetails = {
	id: 2,
	email: 'user2@gmail.com',
	firstName: 'user2-first',
	lastName: 'user2-last',
	enabled: true
};

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
	users: [clientUser1]
};

const userList: UserList = {
	users: [user1,user2]
};

const mockGetFullClientDetails = (clientArg: FullClientDetails) =>
    (getFullClientDetails as jest.Mock).mockImplementation(() => TE.right(clientArg));

const mockGetAllUsers = (userListArg: UserList) =>
	(getAllUsers as jest.Mock).mockImplementation(() => TE.right(userListArg));

describe('ClientGrants', () => {
	let testHistory: MemoryHistory;
	beforeEach(() => {
		jest.resetAllMocks();
		testHistory = createMemoryHistory();
		testHistory.push('/clients/1/grants');
	});

	describe('rendering', () => {
		it('renders with users', async () => {
			mockGetFullClientDetails(client);
			mockGetAllUsers(userList);

			await doRender(testHistory);

			expect(screen.queryByText('Client Name'))
				.toBeInTheDocument();
			expect(screen.queryByText('Users'))
				.toBeInTheDocument();
			expect(screen.queryByText(`${user1.firstName} ${user1.lastName}`))
				.toBeInTheDocument();
			expect(screen.queryByText('Roles'))
				.toBeInTheDocument();
			const addUserButton = screen.queryByRole('button', {
				name: 'Add User'
			});
			expect(addUserButton).not.toBeDisabled();

			expect(getFullClientDetails).toHaveBeenCalledWith(1);
			expect(getAllUsers).toHaveBeenCalled();
		});

		it('renders without users', async () => {
			mockGetFullClientDetails({
				...client,
				users: []
			});
			mockGetAllUsers(userList);

			await doRender(testHistory);

			expect(screen.queryByText('Client Name'))
				.toBeInTheDocument();
			expect(screen.queryByText('Users'))
				.toBeInTheDocument();
			expect(screen.queryByText('No Users'))
				.toBeInTheDocument();
			expect(screen.queryByText('Roles'))
				.toBeInTheDocument();
			const addUserButton = screen.queryByRole('button', {
				name: 'Add User'
			});
			expect(addUserButton).not.toBeDisabled();

			expect(getFullClientDetails).toHaveBeenCalledWith(1);
			expect(getAllUsers).toHaveBeenCalled();
		});

		it('renders without users with add button disabled', async () => {
			mockGetFullClientDetails({
				...client,
				users: []
			});
			mockGetAllUsers({
				users: []
			});

			await doRender(testHistory);

			expect(screen.queryByText('Client Name'))
				.toBeInTheDocument();
			expect(screen.queryByText('Users'))
				.toBeInTheDocument();
			expect(screen.queryByText('No Users'))
				.toBeInTheDocument();
			expect(screen.queryByText('Roles'))
				.toBeInTheDocument();
			const addUserButton = screen.queryByRole('button', {
				name: 'Add User'
			});
			expect(addUserButton).toBeDisabled();

			expect(getFullClientDetails).toHaveBeenCalledWith(1);
			expect(getAllUsers).toHaveBeenCalled();
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
