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
import { exists, getOrElse, isNone, map, Option } from 'fp-ts/es6/Option';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/es6/pipeable';
import * as TE from 'fp-ts/es6/TaskEither';
import * as T from 'fp-ts/es6/Task';
import { useImmer } from 'use-immer';
import {
	ConfirmDialog,
	SectionHeader
} from '@craigmiller160/react-material-ui-common';
import { nanoid } from 'nanoid';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import {
	addRoleToUser,
	removeRoleFromUser
} from '../../../../../services/UserService';
import List, { Item } from '../../../../ui/List';
import { UserClient, UserRole } from '../../../../../types/user';
import SelectDialog from '../../../../ui/Dialog/SelectDialog';

interface Props {
	selectedClient: Option<UserClient>;
	userId: number;
	updateUserRoles: (clientId: number, userRoles: Array<UserRole>) => void;
}

interface State {
	showAddRoleDialog: boolean;
	showRemoveRoleDialog: boolean;
	roleIdToRemove: number;
}

const UserRoles = (props: Props) => {
	const { selectedClient, userId, updateUserRoles } = props;
	const [state, setState] = useImmer<State>({
		showAddRoleDialog: false,
		showRemoveRoleDialog: false,
		roleIdToRemove: 0
	});

	const clientId = pipe(
		selectedClient,
		map((client: UserClient) => client.id),
		getOrElse(() => 0)
	);

	if (isNone(selectedClient)) {
		return <div />;
	}

	const removeRoleClick = (roleId: number) =>
		setState((draft) => {
			draft.roleIdToRemove = roleId;
			draft.showRemoveRoleDialog = true;
		});

	const roleItems: Array<Item> = pipe(
		selectedClient,
		map((selected: UserClient) => selected.userRoles),
		getOrElse((): Array<UserRole> => [])
	).map((role: UserRole) => ({
		uuid: nanoid(),
		text: {
			primary: role.name
		},
		secondaryActions: [
			{
				uuid: nanoid(),
				text: 'Remove',
				click: () => removeRoleClick(role.id)
			}
		]
	}));

	const roleOptions: Array<SelectOption<number>> = pipe(
		selectedClient,
		map((client: UserClient) =>
			client.allRoles.filter(
				(r1) => !client.userRoles.find((r2) => r1.id === r2.id)
			)
		),
		getOrElse((): Array<UserRole> => [])
	).map((role: UserRole) => ({
		label: role.name,
		value: role.id
	}));

	const addRoleClick = () =>
		setState((draft) => {
			draft.showAddRoleDialog = true;
		});

	const addRoleOnCancel = () =>
		setState((draft) => {
			draft.showAddRoleDialog = false;
		});

	const addRoleOnSelect = (selectedRole: SelectOption<number>) => {
		setState((draft) => {
			draft.showAddRoleDialog = false;
		});
		const roleId = selectedRole.value;
		pipe(
			addRoleToUser(userId, clientId, roleId),
			TE.fold(
				(): T.Task<UserRole[]> => T.of([]),
				(userRoles: UserRole[]): T.Task<UserRole[]> => T.of(userRoles)
			),
			T.map((userRoles: UserRole[]) =>
				updateUserRoles(clientId, userRoles)
			)
		)();
	};

	const removeOnConfirm = () => {
		setState((draft) => {
			draft.showRemoveRoleDialog = false;
		});
		pipe(
			removeRoleFromUser(userId, clientId, state.roleIdToRemove),
			TE.fold(
				(): T.Task<UserRole[]> => T.of([]),
				(userRoles: UserRole[]): T.Task<UserRole[]> => T.of(userRoles)
			),
			T.map((userRoles: UserRole[]) =>
				updateUserRoles(clientId, userRoles)
			)
		)();
	};

	const removeOnCancel = () =>
		setState((draft) => {
			draft.showRemoveRoleDialog = false;
		});

	return (
		<>
			<SectionHeader title="Roles" />
			{exists((selected: UserClient) => selected.allRoles.length === 0)(
				selectedClient
			) && <Typography variant="h6">No Roles</Typography>}
			{exists((selected: UserClient) => selected.allRoles.length > 0)(
				selectedClient
			) && (
				<>
					<List items={roleItems} />
					<Button
						color="primary"
						variant="contained"
						onClick={addRoleClick}
					>
						Add Role
					</Button>
				</>
			)}
			<SelectDialog
				open={state.showAddRoleDialog}
				title="Add Role"
				onSelect={addRoleOnSelect}
				onCancel={addRoleOnCancel}
				options={roleOptions}
				label="Select Role"
			/>
			<ConfirmDialog
				open={state.showRemoveRoleDialog}
				title="Remove Role"
				message="Are you sure you want to remove this role?"
				onConfirm={removeOnConfirm}
				onCancel={removeOnCancel}
			/>
		</>
	);
};

export default UserRoles;
