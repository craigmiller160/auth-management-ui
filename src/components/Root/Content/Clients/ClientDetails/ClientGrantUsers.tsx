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
import List, { Item } from '../../../../ui/List';
import PersonIcon from '@material-ui/icons/Person';
import { exists, Option } from 'fp-ts/es6/Option';
import { ClientUser } from '../../../../../types/client';
import { useHistory } from 'react-router';
import { UserDetails } from '../../../../../types/user';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { Button, Typography } from '@material-ui/core';
import { useImmer } from 'use-immer';
import { ConfirmDialog, SelectDialog } from '../../../../ui/Dialog';
import { SectionHeader } from '@craigmiller160/react-material-ui-common';

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

    const [state, setState] = useImmer<State>({
        showUserDialog: false,
        showRemoveDialog: false,
        userToRemoveId: 0
    });

    const showRemoveDialog = (userId: number) =>
        setState((draft) => {
            draft.showRemoveDialog = true;
            draft.userToRemoveId = userId;
        });

    const userItems: Array<Item> = clientUsers
        .map((user) => ({
            avatar: () => <PersonIcon />,
            click: () => selectUser(user),
            active: exists((selected: ClientUser) => selected.id === user.id)(selectedUser),
            text: {
                primary: `${user.firstName} ${user.lastName}`,
                secondary: user.roles.map((role) => role.name).join(', ')
            },
            secondaryActions: [
                {
                    text: 'Go',
                    click: () => history.push(`/users/${user.id}`)
                },
                {
                    text: 'Remove',
                    click: (event: MouseEvent) => {
                        event.stopPropagation();
                        showRemoveDialog(user.id);
                    }
                }
            ]
        }));

    const availableUserOptions:  Array<SelectOption<number>> = allUsers
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
            <SectionHeader title="Users" />
            {
                userItems.length > 0 &&
                <List items={ userItems } />
            }
            {
                userItems.length === 0 &&
                <Typography
                    className="no-items"
                    variant="body1"
                >
                    No Users
                </Typography>
            }
            <Button
                variant="contained"
                color="primary"
                onClick={ () => setState((draft) => {
                    draft.showUserDialog = true;
                }) }
                disabled={ availableUserOptions.length === 0 }
            >
                Add User
            </Button>
            <SelectDialog
                label="User"
                open={ state.showUserDialog }
                title="Add User"
                onSelect={ doSaveAddUser }
                onCancel={ () => setState((draft) => {
                    draft.showUserDialog = false;
                }) }
                options={ availableUserOptions }
            />
            <ConfirmDialog
                open={ state.showRemoveDialog }
                title="Remove User"
                message="Are you sure you want to remove this user?"
                onConfirm={ doRemoveUser }
                onCancel={ () => setState((draft) => {
                    draft.showRemoveDialog = false;
                }) }
            />
        </>
    );
};

export default ClientGrantUsers;
