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

import React, { MouseEvent } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { exists, Option } from 'fp-ts/es6/Option';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useImmer } from 'use-immer';
import {
  ConfirmDialog,
  SectionHeader
} from '@craigmiller160/react-material-ui-common';
import { nanoid } from 'nanoid';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { UserDetails } from '../../../../../types/user';
import { ClientUser } from '../../../../../types/client';
import List, { Item } from '../../../../ui/List';
import SelectDialog from '../../../../ui/Dialog/SelectDialog';

interface Props {
  clientUsers: Array<ClientUser>;
  selectUser: (user: ClientUser) => void;
  removeUser: (userId: number) => void;
  selectedUser: Option<ClientUser>;
  allUsers: Array<UserDetails>;
  saveAddUser: (userId: number) => void;
}

interface State {
  showUserDialog: boolean;
  showRemoveDialog: boolean;
  userToRemoveId: number;
}

const ClientGrantUsers = (props: Props) => {
  const history = useHistory();
  const {
    clientUsers,
    selectUser,
    removeUser,
    selectedUser,
    allUsers,
    saveAddUser
  } = props;

  const [ state, setState ] = useImmer<State>({
    showUserDialog: false,
    showRemoveDialog: false,
    userToRemoveId: 0
  });

  const showRemoveDialog = (userId: number) =>
    setState((draft) => {
      draft.showRemoveDialog = true;
      draft.userToRemoveId = userId;
    });

  const userItems: Array<Item> = clientUsers.map((user) => ({
    uuid: nanoid(),
    avatar: () => <PersonIcon />,
    click: () => selectUser(user),
    active: exists((selected: ClientUser) => selected.id === user.id)(
      selectedUser
    ),
    text: {
      primary: `${user.firstName} ${user.lastName}`,
      secondary: user.roles.map((role) => role.name).join(', ')
    },
    secondaryActions: [
      {
        uuid: nanoid(),
        text: 'Go',
        click: () => history.push(`/users/${user.id}`)
      },
      {
        uuid: nanoid(),
        text: 'Remove',
        click: (event: MouseEvent) => {
          event.stopPropagation();
          showRemoveDialog(user.id);
        }
      }
    ]
  }));

  const availableUserOptions: Array<SelectOption<number>> = allUsers
    .filter((user) => {
      const index = clientUsers.findIndex((cUser) => cUser.id === user.id);
      return index === -1;
    })
    .map((user) => ({
      value: user.id,
      label: user.email
    }));

  const doSaveAddUser = (selected: SelectOption<number>) => {
    setState((draft) => {
      draft.showUserDialog = false;
    });
    saveAddUser(selected.value);
  };

  const doRemoveUser = () => {
    setState((draft) => {
      draft.showRemoveDialog = false;
    });
    removeUser(state.userToRemoveId);
  };

  return (
    <>
      <SectionHeader id="client-grant-users-title" title="Users" />
      {userItems.length > 0 && (
        <List id="client-grant-users-list" items={userItems} />
      )}
      {userItems.length === 0 && (
        <Typography
          id="no-client-grant-users-msg"
          className="no-items"
          variant="body1"
        >
          No Users
        </Typography>
      )}
      <Button
        id="add-client-user-btn"
        variant="contained"
        color="primary"
        onClick={() =>
          setState((draft) => {
            draft.showUserDialog = true;
          })
        }
        disabled={availableUserOptions.length === 0}
      >
        Add User
      </Button>
      <SelectDialog
        id="add-client-user-dialog"
        label="User"
        open={state.showUserDialog}
        title="Add User"
        onSelect={doSaveAddUser}
        onCancel={() =>
          setState((draft) => {
            draft.showUserDialog = false;
          })
        }
        options={availableUserOptions}
      />
      <ConfirmDialog
        id="remove-client-user-dialog"
        open={state.showRemoveDialog}
        title="Remove User"
        message="Are you sure you want to remove this user?"
        onConfirm={doRemoveUser}
        onCancel={() =>
          setState((draft) => {
            draft.showRemoveDialog = false;
          })
        }
      />
    </>
  );
};

export default ClientGrantUsers;
