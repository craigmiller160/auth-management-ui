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
import { Grid, Typography } from '@material-ui/core';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import { pipe } from 'fp-ts/es6/pipeable';
import { map } from 'fp-ts/es6/Either';
import Button from '@material-ui/core/Button';
import { ConfirmDialog, SectionHeader } from '@craigmiller160/react-material-ui-common';
import List, { Item } from '../../../../ui/List';
import { ClientRole } from '../../../../../types/client';
import { getClientWithRoles } from '../../../../../services/ClientService';
import './ClientRoles.scss';
import { createRole, deleteRole, updateRole } from '../../../../../services/RoleService';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import InputDialog from '../../../../ui/Dialog/InputDialog';

const ROLE_PREFIX = 'ROLE_';

interface Props extends IdMatchProps {}

interface State {
    showRoleDialog: boolean;
    selectedRoleIndex: number;
    showDeleteDialog: boolean;
    clientName: string;
    roles: Array<ClientRole>;
    clientId: number;
}

const ClientRoles = (props: Props) => {
    const { id } = props.match.params;
    const [ state, setState ] = useImmer<State>({
        showRoleDialog: false,
        showDeleteDialog: false,
        selectedRoleIndex: -1,
        clientName: '',
        roles: [],
        clientId: id !== NEW_ID ? parseInt(id) : 0
    });

    const loadClientRoles = useCallback(async () => {
        pipe(
            await getClientWithRoles(state.clientId),
            map((clientRoles) => {
                setState((draft) => {
                    draft.roles = clientRoles.roles;
                    draft.clientName = clientRoles.name;
                    draft.clientId = clientRoles.id;
                });
            })
        );
    }, [ state.clientId, setState ]);

    useEffect(() => {
        loadClientRoles();
    }, [ loadClientRoles ]);

    const selectRole = (index: number) => {
        setState((draft) => {
            draft.selectedRoleIndex = index;
            draft.showRoleDialog = true;
        });
    };

    const checkDelete = (index: number) => {
        setState((draft) => {
            draft.showDeleteDialog = true;
            draft.selectedRoleIndex = index;
        });
    };

    const saveRole = async (value: string) => {
        const roleName = `${ROLE_PREFIX}${value}`;
        const roleId = state.selectedRoleIndex >= 0 ? state.roles[state.selectedRoleIndex].id : 0;
        const role = {
            id: roleId,
            clientId: state.clientId,
            name: roleName
        };

        let action;
        if (state.selectedRoleIndex >= 0) {
            action = () => updateRole(state.clientId, role.id, role);
        } else {
            action = () => createRole(state.clientId, role);
        }
        pipe(
            await action(),
            map(() => {
                setState((draft) => {
                    draft.selectedRoleIndex = -1;
                    draft.showRoleDialog = false;
                });
                loadClientRoles();
            })
        );
    };

    const cancelRoleDialog = () =>
        setState((draft) => {
            draft.showRoleDialog = false;
            draft.selectedRoleIndex = -1;
        });

    const items: Array<Item> = state.roles.map((role, index) => ({
        avatar: () => <AssignIcon />,
        text: {
            primary: role.name
        },
        secondaryActions: [
            {
                text: 'Edit',
                click: () => selectRole(index)
            },
            {
                text: 'Delete',
                click: () => checkDelete(index)
            }
        ]
    }));

    const getSelectedRole = () => {
        if (state.selectedRoleIndex >= 0) {
            return state.roles[state.selectedRoleIndex].name
                .replace(ROLE_PREFIX, '');
        }

        return '';
    };

    const doDeleteRole = async () => {
        const selectedRole = state.roles[state.selectedRoleIndex];
        setState((draft) => {
            draft.showDeleteDialog = false;
            draft.selectedRoleIndex = -1;
        });
        pipe(
            await deleteRole(selectedRole.id),
            map(() => {
                loadClientRoles();
            })
        );
    };

    const hideDeleteDialog = () =>
        setState((draft) => {
            draft.showDeleteDialog = false;
        });

    return (
        <div id="client-roles-page" className="ClientRoles">
            <SectionHeader
                id="client-roles-title"
                title={ state.clientName }
                noDivider
            />
            <Grid
                container
                direction="row"
                justify="center"
            >
                <Grid
                    item
                    md={ 5 }
                >
                    {
                        items.length > 0 &&
                        <List
                            id="client-roles-list"
                            items={ items }
                        />
                    }
                    {
                        items.length === 0 &&
                        <Typography
                            id="no-roles-msg"
                            className="no-roles"
                            variant="body1"
                        >
                            No Roles
                        </Typography>
                    }
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
            >
                <Grid
                    item
                    md={ 5 }
                >
                    <Button
                        id="add-role-btn"
                        className="AddRole"
                        color="primary"
                        variant="contained"
                        onClick={ () => selectRole(-1) }
                    >
                        Add Role
                    </Button>
                </Grid>
            </Grid>
            <InputDialog
                id="client-role-dialog"
                open={ state.showRoleDialog }
                title="Role"
                onCancel={ cancelRoleDialog }
                onSave={ saveRole }
                label="Role"
                transform={ (value: string) => value?.toUpperCase() ?? '' }
                prefix={ ROLE_PREFIX }
                initialValue={ getSelectedRole() }
            />
            <ConfirmDialog
                id="delete-client-role-dialog"
                open={ state.showDeleteDialog }
                title="Delete Role"
                message="Are you sure you want to delete this role?"
                onConfirm={ doDeleteRole }
                onCancel={ hideDeleteDialog }
            />
        </div>
    );
};

export default ClientRoles;
