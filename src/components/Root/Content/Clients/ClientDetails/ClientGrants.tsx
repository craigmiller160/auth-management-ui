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
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { addUserToClient, getFullClientDetails, removeUserFromClient } from '../../../../../services/ClientService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { ClientRole, ClientUser } from '../../../../../types/client';
import { Grid } from '@material-ui/core';
import './ClientGrants.scss';
import { addRoleToUser, getAllUsers, removeRoleFromUser } from '../../../../../services/UserService';
import { UserDetails } from '../../../../../types/user';
import { fromNullable, getOrElse as oGetOrElse, map as oMap, none, Option, some } from 'fp-ts/es6/Option';
import ClientGrantUsers from './ClientGrantUsers';
import ClientGrantRoles from './ClientGrantRoles';
import { SectionHeader } from '@craigmiller160/react-material-ui-common';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    allRoles: Array<ClientRole>;
    clientUsers: Array<ClientUser>;
    allUsers: Array<UserDetails>;
    selectedUser: Option<ClientUser>;
}

const ClientGrants = (props: Props) => {
    const id = props.match.params.id;

    const [state, setState] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        clientName: '',
        allRoles: [],
        clientUsers: [],
        allUsers: [],
        selectedUser: none
    });

    const loadFullClientDetails = useCallback(async () =>
        pipe(
            await getFullClientDetails(state.clientId),
            map( (fullClientDetails) => {
                setState((draft) => {
                    draft.clientName = fullClientDetails.name;
                    draft.allRoles = fullClientDetails.roles;
                    draft.clientUsers = fullClientDetails.users;
                });
                return fullClientDetails.users;
            }),
            getOrElse((): Array<ClientUser> => [])
        ), [state.clientId, setState]);

    const loadUsers = useCallback(async (clientUsers: Array<ClientUser>) =>
        pipe(
            await getAllUsers(),
            map((list) => list.users),
            map((users) =>
                users.filter((user) => {
                    const index = clientUsers.findIndex((cUser) => cUser.id === user.id);
                    return index === -1;
                })
            ),
            map((users) =>
                setState((draft) => {
                    draft.allUsers = users;
                })
            )
        ), [setState]);

    const loadAll = useCallback(async () => {
        const clientUsers = await loadFullClientDetails();
        await loadUsers(clientUsers);
    }, [loadFullClientDetails, loadUsers]);

    const removeUser = async (userId: number) => {
        await removeUserFromClient(userId, state.clientId);
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
        await loadAll();
    };

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const saveAddRole = (roleId: number) =>
        pipe(
            state.selectedUser,
            oMap(async (selectedUser) => {
                await addRoleToUser(selectedUser.id, state.clientId, roleId);
                await loadAll();
                setState((draft) => {
                    pipe(
                        draft.selectedUser,
                        oMap((oldSelectedUser) => {
                            draft.selectedUser = fromNullable(
                                draft.clientUsers
                                    .find((user) => user.id === oldSelectedUser.id)
                            );
                        })
                    );
                });
            })
        );

    const removeRole = (roleId: number) =>
        pipe(
            state.selectedUser,
            oMap(async (selectedUser) => {
                await removeRoleFromUser(selectedUser.id, state.clientId, roleId);
                await loadAll();
                setState((draft) => {
                    pipe(
                        draft.selectedUser,
                        oMap((oldSelectedUser) => {
                            draft.selectedUser = fromNullable(
                                draft.clientUsers
                                    .find((user) => user.id === oldSelectedUser.id)
                            );
                        })
                    );
                });
            })
        );

    const saveAddUser = async (userId: number) => {
        await addUserToClient(userId, state.clientId);
        await loadAll();
    };

    const selectUser = (user: ClientUser) =>
        setState((draft) => {
            draft.selectedUser = some(user);
        });

    return (
        <div className="ClientGrants">
            <SectionHeader
                title={ state.clientName }
                noDivider
            />
            <Grid
                container
                direction="row"
                justify="space-around"
            >
                <Grid
                    direction="column"
                    container
                    item
                    md={ 5 }
                >
                    <ClientGrantUsers
                        clientUsers={ state.clientUsers }
                        selectUser={ selectUser }
                        removeUser={ removeUser }
                        selectedUser={ state.selectedUser }
                        allUsers={ state.allUsers }
                        saveAddUser={ saveAddUser }
                    />
                </Grid>
                <Grid item md={ 2 } />
                <Grid
                    direction="column"
                    container
                    item
                    md={ 5 }
                >
                    <SectionHeader title="Roles" />
                    {
                        pipe(
                            state.selectedUser,
                            oMap((selectedUser: ClientUser) => (
                                <ClientGrantRoles
                                    selectedUser={ selectedUser }
                                    removeRole={ removeRole }
                                    saveAddRole={ saveAddRole }
                                    allRoles={ state.allRoles }
                                />
                            )),
                            oGetOrElse(() => <div />)
                        )
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default ClientGrants;
