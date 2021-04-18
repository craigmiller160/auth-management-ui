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

import React, { MouseEvent, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useImmer } from 'use-immer';
import Button from '@material-ui/core/Button';
import Business from '@material-ui/icons/Business';
import { exists, Option } from 'fp-ts/es6/Option';
import * as TE from 'fp-ts/es6/TaskEither';
import * as T from 'fp-ts/es6/Task';
import { pipe } from 'fp-ts/es6/pipeable';
import {
	ConfirmDialog,
	SectionHeader
} from '@craigmiller160/react-material-ui-common';
import { nanoid } from 'nanoid';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import {
	addClientToUser,
	removeClientFromUser
} from '../../../../../services/UserService';
import { getAllClients } from '../../../../../services/ClientService';
import List, { Item } from '../../../../ui/List';
import { UserClient } from '../../../../../types/user';
import {
	ClientListItem,
	ClientListResponse
} from '../../../../../types/client';
import SelectDialog from '../../../../ui/Dialog/SelectDialog';

interface Props {
	userClients: Array<UserClient>;
	userId: number;
	updateClients: (clients: Array<UserClient>) => void;
	selectedClient: Option<UserClient>;
	selectClient: (client: UserClient) => void;
}

interface State {
	allClients: Array<ClientListItem>;
	showAddClientDialog: boolean;
	showRemoveClientDialog: boolean;
	clientIdToRemove: number;
}

const UserClients = (props: Props) => {
	const {
		userClients,
		userId,
		updateClients,
		selectedClient,
		selectClient
	} = props;

	const history = useHistory();
	const [state, setState] = useImmer<State>({
		allClients: [],
		showAddClientDialog: false,
		showRemoveClientDialog: false,
		clientIdToRemove: 0
	});

	useEffect(() => {
		const action = () =>
			pipe(
				getAllClients(),
				TE.fold(
					(): T.Task<ClientListItem[]> => T.of([]),
					(res: ClientListResponse): T.Task<ClientListItem[]> =>
						T.of(res.clients)
				),
				T.map((items: ClientListItem[]) =>
					setState((draft) => {
						draft.allClients = items;
					})
				)
			)();

		action();
	}, [setState]);

	const goToClient = (clientId: number) =>
		history.push(`/clients/${clientId}`);

	const removeClientClick = (clientId: number) => {
		setState((draft) => {
			draft.clientIdToRemove = clientId;
			draft.showRemoveClientDialog = true;
		});
	};

	const clientItems: Array<Item> = userClients.map((client) => ({
		uuid: nanoid(),
		click: () => selectClient(client),
		avatar: () => <Business />,
		text: {
			primary: client.name
		},
		secondaryActions: [
			{
				uuid: nanoid(),
				text: 'Go',
				click: () => goToClient(client.id)
			},
			{
				uuid: nanoid(),
				text: 'Remove',
				click: (event: MouseEvent) => {
					event.stopPropagation();
					removeClientClick(client.id);
				}
			}
		],
		active: exists((selected: UserClient) => selected.id === client.id)(
			selectedClient
		)
	}));

	const addClientClick = () =>
		setState((draft) => {
			draft.showAddClientDialog = true;
		});

	const addClientSelect = (clientToAdd: SelectOption<number>) => {
		setState((draft) => {
			draft.showAddClientDialog = false;
		});
		const clientId = clientToAdd.value;
		pipe(
			addClientToUser(userId, clientId),
			TE.fold(
				(): T.Task<UserClient[]> => T.of([]),
				(clients: UserClient[]): T.Task<UserClient[]> => T.of(clients)
			),
			T.map((clients: UserClient[]) => updateClients(clients))
		)();
	};

	const addClientCancel = () =>
		setState((draft) => {
			draft.showAddClientDialog = false;
		});

	const clientOptions = useMemo(
		() =>
			state.allClients
				.filter(
					(client) =>
						!userClients.find(
							(otherClient) => client.id === otherClient.id
						)
				)
				.sort((client1, client2) =>
					client1.name.localeCompare(client2.name)
				)
				.map((client) => ({
					label: client.name,
					value: client.id
				})),
		[state.allClients, userClients]
	);

	const removeClientOnCancel = () =>
		setState((draft) => {
			draft.showRemoveClientDialog = false;
		});

	const removeClientOnConfirm = () => {
		setState((draft) => {
			draft.showRemoveClientDialog = false;
		});
		pipe(
			removeClientFromUser(userId, state.clientIdToRemove),
			TE.fold(
				(): T.Task<UserClient[]> => T.of([]),
				(clients: UserClient[]): T.Task<UserClient[]> => T.of(clients)
			),
			T.map((clients: UserClient[]) => updateClients(clients))
		)();
	};

	return (
		<>
			<SectionHeader title="Clients" />
			<List items={clientItems} />
			<Button
				color="primary"
				variant="contained"
				onClick={addClientClick}
			>
				Add Client
			</Button>
			<SelectDialog
				open={state.showAddClientDialog}
				title="Add Client"
				onSelect={addClientSelect}
				onCancel={addClientCancel}
				options={clientOptions}
				label="Select Client"
			/>
			<ConfirmDialog
				open={state.showRemoveClientDialog}
				title="Remove Client"
				message="Are you sure you want to remove this client from this user?"
				onConfirm={removeClientOnConfirm}
				onCancel={removeClientOnCancel}
			/>
		</>
	);
};

export default UserClients;
