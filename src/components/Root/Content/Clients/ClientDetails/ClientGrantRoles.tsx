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
import { ClientRole, ClientUser } from '../../../../../types/client';
import { useImmer } from 'use-immer';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import List, { Item } from '../../../../ui/List';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { Button, Typography } from '@material-ui/core';
import { ConfirmDialog, SelectDialog } from '../../../../ui/Dialog';

interface Props {
    selectedUser: ClientUser;
    removeRole: (roleId: number) => void;
    saveAddRole: (roleId: number) => void;
    allRoles: Array<ClientRole>;
}

interface State {
    showRoleDialog: boolean;
    showRemoveDialog: boolean;
    roleToRemoveId: number;
}

const ClientGrantRoles = (props: Props) => {
    const {
        selectedUser,
        removeRole,
        saveAddRole,
        allRoles
    } = props;

    const [state, setState] = useImmer<State>({
        showRoleDialog: false,
        showRemoveDialog: false,
        roleToRemoveId: 0
    });

    const doSaveAddRole = (selected: SelectOption<number>) => {
        setState((draft) => {
            draft.showRoleDialog = false;
        });
        saveAddRole(selected.value);
    };

    const showRemoveDialog = (roleId: number) =>
        setState((draft) => {
            draft.roleToRemoveId = roleId;
            draft.showRemoveDialog = true;
        });

    const roleItems: Array<Item> = selectedUser.roles
        .map((role) => ({
            avatar: () => <AssignIcon />,
            text: {
                primary: role.name
            },
            secondaryActions: [
                {
                    text: 'Remove',
                    click: () => showRemoveDialog(role.id)
                }
            ]
        }));

    const roleOptions: Array<SelectOption<number>> = allRoles
        .filter((role) => {
            const index = selectedUser.roles.findIndex((uRole) => uRole.id === role.id);
            return index === -1;
        })
        .map((role) => ({
            value: role.id,
            label: role.name
        }));

    const doRemoveRole = () => {
        setState((draft) => {
            draft.showRemoveDialog = false;
        });
        removeRole(state.roleToRemoveId);
    };

    return (
        <>
            {
                roleItems.length > 0 &&
                <List items={ roleItems } />
            }
            {
                roleItems.length === 0 &&
                <Typography
                    className="no-items"
                    variant="body1"
                >
                    No Roles
                </Typography>
            }
            <Button
                variant="contained"
                color="primary"
                onClick={ () => setState((draft) => {
                    draft.showRoleDialog = true;
                }) }
                disabled={ roleOptions.length === 0 }
            >
                Add Role
            </Button>
            <SelectDialog
                label="Role"
                open={ state.showRoleDialog }
                title="Add Role"
                onSelect={ doSaveAddRole }
                onCancel={ () => setState((draft) => {
                    draft.showRoleDialog = false;
                }) }
                options={ roleOptions }
            />
            <ConfirmDialog
                open={ state.showRemoveDialog }
                title="Remove Role"
                message="Are you sure you want to remove this role?"
                onConfirm={ doRemoveRole }
                onCancel={ () => setState((draft) => {
                    draft.showRemoveDialog = false;
                }) }
            />
        </>
    );
};

export default ClientGrantRoles;