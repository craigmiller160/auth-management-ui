import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import React from 'react';
import ClientGrants from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientGrants';
import {
	ClientUser,
	FullClientDetails
} from '../../../../../../src/types/client';
import { addUserToClient, getFullClientDetails } from '../../../../../../src/services/ClientService';
import * as TE from 'fp-ts/es6/TaskEither';
import { getAllUsers } from '../../../../../../src/services/UserService';
import { UserDetails, UserList } from '../../../../../../src/types/user';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../../../src/services/ClientService', () => ({
	getFullClientDetails: jest.fn(),
	addUserToClient: jest.fn(),
	removeUserFromClient: jest.fn()
}));

jest.mock('../../../../../../src/services/UserService', () => ({
	getAllUsers: jest.fn()
}));

const [TestReduxProvider] = createTestReduxProvider({});

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

const clientUser2: ClientUser = {
	...user2,
	roles: []
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
	users: [user1, user2]
};

const mockGetFullClientDetails = (clientArg: FullClientDetails) =>
	(getFullClientDetails as jest.Mock).mockImplementationOnce(() =>
		TE.right(clientArg)
	);

const mockGetAllUsers = (userListArg: UserList) =>
	(getAllUsers as jest.Mock).mockImplementationOnce(() => TE.right(userListArg));

const mockAddUserToClient = () =>
	(addUserToClient as jest.Mock).mockImplementationOnce(() => TE.right([]));

const getAddUserBtn = () => screen.getByRole('button', {
	name: 'Add User'
});

describe('ClientGrants', () => {
	let testHistory: MemoryHistory;
	beforeEach(() => {
		jest.resetAllMocks();
		testHistory = createMemoryHistory();
		testHistory.push('/clients/1/grants');

		mockAddUserToClient();
	});

	describe('rendering', () => {
		it('renders with users', async () => {
			mockGetFullClientDetails(client);
			mockGetAllUsers(userList);

			await doRender(testHistory);

			expect(screen.queryByText('Client Name')).toBeInTheDocument();
			expect(screen.queryByText('Users')).toBeInTheDocument();
			expect(
				screen.queryByText(`${user1.firstName} ${user1.lastName}`)
			).toBeInTheDocument();
			expect(screen.queryByText('Roles')).toBeInTheDocument();
			const addUserButton = getAddUserBtn();
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

			expect(screen.queryByText('Client Name')).toBeInTheDocument();
			expect(screen.queryByText('Users')).toBeInTheDocument();
			expect(screen.queryByText('No Users')).toBeInTheDocument();
			expect(screen.queryByText('Roles')).toBeInTheDocument();
			const addUserButton = getAddUserBtn();
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

			expect(screen.queryByText('Client Name')).toBeInTheDocument();
			expect(screen.queryByText('Users')).toBeInTheDocument();
			expect(screen.queryByText('No Users')).toBeInTheDocument();
			expect(screen.queryByText('Roles')).toBeInTheDocument();
			const addUserButton = getAddUserBtn();
			expect(addUserButton).toBeDisabled();

			expect(getFullClientDetails).toHaveBeenCalledWith(1);
			expect(getAllUsers).toHaveBeenCalled();
		});
	});

	describe('behavior', () => {
		it('add a user, with no more users available to add', async () => {
			mockGetFullClientDetails(client);
			mockGetFullClientDetails({
				...client,
				users: [
					clientUser1,
					clientUser2
				]
			})
			mockGetAllUsers(userList);
			mockGetAllUsers(userList);

			await doRender(testHistory);

			expect(
				screen.queryByText(`${user2.firstName} ${user2.lastName}`)
			).not.toBeInTheDocument();

			const addUserButton = getAddUserBtn();
			expect(addUserButton).not.toBeDisabled();

			await waitFor(() => userEvent.click(addUserButton));

			expect(screen.queryByLabelText('User'))
				.toBeInTheDocument();
			expect(screen.queryByText('Select'))
				.toBeInTheDocument();
			expect(screen.queryByText('Cancel'))
				.toBeInTheDocument();

			userEvent.click(screen.getByLabelText('User'));
			userEvent.click(screen.getByText('user2@gmail.com'));
			expect(screen.getByLabelText('User'))
				.toHaveValue('user2@gmail.com');

			await waitFor(() => userEvent.click(screen.getByRole('button', {
				name: 'Select'
			})));

			expect(
				screen.queryByText(`${user2.firstName} ${user2.lastName}`)
			).toBeInTheDocument();

			expect(addUserButton).toBeDisabled();

			expect(addUserToClient).toHaveBeenCalledWith(2, 1);
		});

		it('go to a user', async () => {
			mockGetFullClientDetails(client);
			mockGetAllUsers(userList);

			await doRender(testHistory);

			await waitFor(() => userEvent.click(screen.getByRole('button', {
				name: 'Go'
			})));

			expect(testHistory.location.pathname).toEqual('/users/1');
		});

		it('remove a user', async () => {
			mockGetFullClientDetails(client);
			mockGetFullClientDetails({
				...client,
				users: []
			});
			mockGetAllUsers(userList);
			mockGetAllUsers(userList);

			await doRender(testHistory);

			await waitFor(() => userEvent.click(screen.getByRole('button', {
				name: 'Remove'
			})));

			// TODO finish this
		});

		it('add a role to a user', async () => {
			throw new Error();
		});

		it('remove a role from a user', async () => {
			throw new Error();
		});
	});
});
