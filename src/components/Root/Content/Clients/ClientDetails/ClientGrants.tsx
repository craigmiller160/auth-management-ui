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

import React, { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import Grid from '@material-ui/core/Grid';
import * as TE from 'fp-ts/es6/TaskEither';
import {
	fromNullable,
	getOrElse as oGetOrElse,
	map as oMap,
	none,
	Option,
	some
} from 'fp-ts/es6/Option';
import { SectionHeader } from '@craigmiller160/react-material-ui-common';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import {
	addUserToClient,
	getFullClientDetails,
	removeUserFromClient
} from '../../../../../services/ClientService';
import {
	ClientRole,
	ClientUser,
	FullClientDetails
} from '../../../../../types/client';
import './ClientGrants.scss';
import {
	addRoleToUser,
	getAllUsers,
	removeRoleFromUser
} from '../../../../../services/UserService';
import { UserDetails } from '../../../../../types/user';
import ClientGrantUsers from './ClientGrantUsers';
import ClientGrantRoles from './ClientGrantRoles';

type Props = IdMatchProps;

interface State {
	clientId: number;
	clientName: string;
	allRoles: Array<ClientRole>;
	clientUsers: Array<ClientUser>;
	allUsers: Array<UserDetails>;
	selectedUser: Option<ClientUser>;
}

interface LoadingContainer {
	client: FullClientDetails;
	allUsers: UserDetails[];
}

const ClientGrants = (props: Props): JSX.Element => {
	const { id } = props.match.params;

	const [state, setState] = useImmer<State>({
		clientId: id !== NEW_ID ? parseInt(id, 10) : 0,
		clientName: '',
		allRoles: [],
		clientUsers: [],
		allUsers: [],
		selectedUser: none
	});

	const loadEverything = useCallback(
		() =>
			pipe(
				getFullClientDetails(state.clientId),
				TE.chain((clientDetails) =>
					pipe(
						getAllUsers(),
						TE.map((userList) =>
							userList.users.filter((user) => {
								const index = clientDetails.users.findIndex(
									(cUser) => cUser.id === user.id
								);
								return index === -1;
							})
						),
						TE.map(
							(users): LoadingContainer => ({
								client: clientDetails,
								allUsers: users
							})
						)
					)
				),
				TE.map((container) => {
					setState((draft) => {
						draft.clientName = container.client.name;
						draft.allRoles = container.client.roles;
						draft.clientUsers = container.client.users;
						draft.allUsers = container.allUsers;
					});
				})
			)(),
		[setState, state.clientId]
	);

	const removeUser = (userId: number) =>
		pipe(
			removeUserFromClient(userId, state.clientId),
			TE.map(() => {
				pipe(
					state.selectedUser,
					oMap((selectedUser: ClientUser) => {
						if (selectedUser.id === userId) {
							setState((draft) => {
								draft.selectedUser = none;
							});
						}
					})
				);
				loadEverything();
			})
		)();

	const getSelectedUserId = (): number =>
		pipe(
			state.selectedUser,
			oMap((selectedUser) => selectedUser.id),
			oGetOrElse(() => 0)
		);

	const saveAddRole = (roleId: number) => {
		const selectedUserId = getSelectedUserId();

		pipe(
			addRoleToUser(selectedUserId, state.clientId, roleId),
			TE.chain(() => TE.tryCatch(loadEverything, (error) => error)),
			TE.map(() => {
				setState((draft) => {
					draft.selectedUser = fromNullable(
						draft.clientUsers.find(
							(user) => user.id === selectedUserId
						)
					);
				});
			})
		)();
	};

	const removeRole = (roleId: number) => {
		const selectedUserId = getSelectedUserId();

		pipe(
			removeRoleFromUser(selectedUserId, state.clientId, roleId),
			TE.chain(() => TE.tryCatch(loadEverything, (error) => error)),
			TE.map(() => {
				setState((draft) => {
					draft.selectedUser = fromNullable(
						draft.clientUsers.find(
							(user) => user.id === selectedUserId
						)
					);
				});
			})
		)();
	};

	useEffect(() => {
		loadEverything();
	}, [loadEverything]);

	const saveAddUser = (userId: number) =>
		pipe(
			addUserToClient(userId, state.clientId),
			TE.map(() => {
				loadEverything();
			})
		)();

	const selectUser = (user: ClientUser) =>
		setState((draft) => {
			draft.selectedUser = some(user);
		});

	return (
		<div id="client-grants-page" className="ClientGrants">
			<SectionHeader
				id="client-grants-title"
				title={state.clientName}
				noDivider
			/>
			<Grid container direction="row" justify="space-around">
				<Grid direction="column" container item md={5}>
					<ClientGrantUsers
						clientUsers={state.clientUsers}
						selectUser={selectUser}
						removeUser={removeUser}
						selectedUser={state.selectedUser}
						allUsers={state.allUsers}
						saveAddUser={saveAddUser}
					/>
				</Grid>
				<Grid item md={2} />
				<Grid direction="column" container item md={5}>
					<SectionHeader
						id="client-grant-roles-title"
						title="Roles"
					/>
					{pipe(
						state.selectedUser,
						oMap((selectedUser: ClientUser) => (
							<ClientGrantRoles
								selectedUser={selectedUser}
								removeRole={removeRole}
								saveAddRole={saveAddRole}
								allRoles={state.allRoles}
							/>
						)),
						oGetOrElse(() => <div />)
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default ClientGrants;
