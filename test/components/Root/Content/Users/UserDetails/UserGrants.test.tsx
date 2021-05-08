import React from 'react';
import { createTestReduxProvider } from '@craigmiller160/react-test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import { render, waitFor } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import UserGrants from '../../../../../../src/components/Root/Content/Users/UserDetails/UserGrants';

const [TestReduxProvider] = createTestReduxProvider({});

const doRender = (history: MemoryHistory) =>
	waitFor(() =>
		render(
			<TestReduxProvider>
				<Router history={history}>
					<Switch>
						<Route
							path="/users/:id/grants"
							component={UserGrants}
						/>
					</Switch>
				</Router>
			</TestReduxProvider>
		)
	);

describe('UserGrants', () => {
	let testHistory: MemoryHistory;

	beforeEach(() => {
		jest.resetAllMocks();
		testHistory = createMemoryHistory();
		testHistory.push('/users/1/grants');
	});

	describe('rendering', () => {
		it('renders with clients', async () => {
			throw new Error();
		});

		it('renders without clients', async () => {
			throw new Error();
		});

		it('renders without clients with add button disabled', async () => {
			throw new Error();
		});
	});

	describe('behavior', () => {
		it('add a client, with no more clients available to add', async () => {
			throw new Error();
		});

		it('go to a client', async () => {
			throw new Error();
		});

		it('select a client, but no roles available', async () => {
			throw new Error();
		});

		it('select a client and add a role', async () => {
			throw new Error();
		});

		it('select a client and remove a role', async () => {
			throw new Error();
		});

		it('cancel add client dialog', async () => {
			throw new Error();
		});

		it('cancel add role dialog', async () => {
			throw new Error();
		});

		it('cancel remove client dialog', async () => {
			throw new Error();
		});

		it('cancel remove role dialog', async () => {
			throw new Error();
		});
	});
});
