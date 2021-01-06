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
import { map } from 'fp-ts/es6/Either';
import Grid from '@material-ui/core/Grid';
import * as TE from 'fp-ts/es6/TaskEither';
import * as T from 'fp-ts/es6/Task';
import { fromNullable, getOrElse as oGetOrElse, map as oMap, none, Option, some } from 'fp-ts/es6/Option';
import { SectionHeader } from '@craigmiller160/react-material-ui-common';
import { Simulate } from 'react-dom/test-utils';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { addUserToClient, getFullClientDetails, removeUserFromClient } from '../../../../../services/ClientService';
import { ClientRole, ClientUser, FullClientDetails } from '../../../../../types/client';
import './ClientGrants.scss';
import { addRoleToUser, getAllUsers, removeRoleFromUser } from '../../../../../services/UserService';
import { UserDetails, UserList } from '../../../../../types/user';
import ClientGrantUsers from './ClientGrantUsers';
import ClientGrantRoles from './ClientGrantRoles';
import load = Simulate.load;

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
    const { id } = props.match.params;

    const [ state, setState ] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id, 10) : 0,
        clientName: '',
        allRoles: [],
        clientUsers: [],
        allUsers: [],
        selectedUser: none
    });

    const loadFullClientDetails = useCallback((): T.Task<Array<ClientUser>> =>
        pipe(
            getFullClientDetails(state.clientId),
            TE.map((fullClientDetails: FullClientDetails): Array<ClientUser> => {
                setState((draft) => {
                    draft.clientName = fullClientDetails.name;
                    draft.allRoles = fullClientDetails.roles;
                    draft.clientUsers = fullClientDetails.users;
                });
                return fullClientDetails.users;
            }),
            TE.getOrElse((ex: Error): T.Task<Array<ClientUser>> => T.of([]))
        ), [ state.clientId, setState ]);

    const loadUsers = useCallback((clientUsers: Array<ClientUser>) =>
        pipe(
            getAllUsers(),
            TE.map((list: UserList) => list.users),
            TE.map((users: UserDetails[]) => // TODO combine with above function
                users.filter((user) => {
                    const index = clientUsers.findIndex((cUser) => cUser.id === user.id);
                    return index === -1;
                })),
            TE.map((users: UserDetails[]) =>
                setState((draft) => { // TODO see if this can be moved to the end
                    draft.allUsers = users;
                }))
        ),
    [ setState ]);

    // TODO this one is an absolute mess, try to figure out how to optimize this if it works
    const loadAll = useCallback(() =>
        pipe(
            loadFullClientDetails(),
            T.map((clientUsers: Array<ClientUser>) => {
                loadUsers(clientUsers)();
            })
        ),
    [ loadFullClientDetails, loadUsers ]);

    const removeUser = async (userId: number) => {
        await removeUserFromClient(userId, state.clientId)();
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
    }, [ loadAll ]);

    const saveAddRole = (roleId: number) =>
        pipe(
            state.selectedUser,
            oMap(async (selectedUser) => {
                await addRoleToUser(selectedUser.id, state.clientId, roleId)();
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
                await removeRoleFromUser(selectedUser.id, state.clientId, roleId)();
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
        await addUserToClient(userId, state.clientId)();
        await loadAll();
    };

    const selectUser = (user: ClientUser) =>
        setState((draft) => {
            draft.selectedUser = some(user);
        });

    return (
        <div id="client-grants-page" className="ClientGrants">
            <SectionHeader
                id="client-grants-title"
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
                    <SectionHeader
                        id="client-grant-roles-title"
                        title="Roles"
                    />
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
