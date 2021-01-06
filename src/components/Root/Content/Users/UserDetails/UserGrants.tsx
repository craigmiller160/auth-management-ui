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
import { getOrElse } from 'fp-ts/es6/Either';
import * as TE from 'fp-ts/es6/TaskEither';
import * as T from 'fp-ts/es6/Task';
import Grid from '@material-ui/core/Grid';
import { SectionHeader } from '@craigmiller160/react-material-ui-common';
import { getOrElse as oGetOrElse, map, none, Option, some } from 'fp-ts/es6/Option';
import { getUserClients } from '../../../../../services/UserService';
import { UserClient, UserClients as UserClientsType, UserRole } from '../../../../../types/user';
import './UserGrants.scss';
import UserClients from './UserClients';
import UserRoles from './UserRoles';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';

interface State {
    userId: number;
    user: UserClientsType;
    selectedClient: Option<UserClient>;
}
interface Props extends IdMatchProps {}

const defaultUser: UserClientsType = {
    id: 0,
    email: '',
    clients: []
};

const UserGrants = (props: Props) => {
    const { id } = props.match.params;
    const [ state, setState ] = useImmer<State>({
        userId: id !== NEW_ID ? parseInt(id, 10) : 0,
        user: defaultUser,
        selectedClient: none
    });

    const loadUser = useCallback(() =>
        pipe(
            getUserClients(state.userId),
            TE.fold(
                (): T.Task<UserClientsType> => T.of(defaultUser),
                (user: UserClientsType): T.Task<UserClientsType> => T.of(user)
            ),
            T.map((user: UserClientsType) =>
                setState((draft) => {
                    draft.user = user;
                })
            )
        )
    , [ state.userId, setState ]);

    const updateUserRoles = (clientId: number, userRoles: Array<UserRole>) => {
        const newSelectedClient = pipe(
            state.selectedClient,
            map((client: UserClient): UserClient => ({
                ...client,
                userRoles
            }))
        );

        setState((draft) => {
            draft.selectedClient = newSelectedClient;
            const clientIndex = draft.user.clients.findIndex((client) => client.id === clientId);
            if (clientIndex > 0) {
                draft.user.clients[clientIndex] = pipe(
                    newSelectedClient,
                    oGetOrElse((): UserClient => draft.user.clients[clientIndex])
                );
            }
        });
    };

    useEffect(() => {
        loadUser();
    }, [ loadUser ]);

    const selectClient = (client: UserClient) =>
        setState((draft) => {
            draft.selectedClient = some(client);
        });

    return (
        <div className="UserGrants">
            <SectionHeader
                title={ state.user.email }
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
                    <UserClients
                        userClients={ state.user.clients }
                        userId={ state.userId }
                        updateClients={ loadUser }
                        selectedClient={ state.selectedClient }
                        selectClient={ selectClient }
                    />
                </Grid>
                <Grid item md={ 2 } />
                <Grid
                    direction="column"
                    container
                    item
                    md={ 5 }
                >
                    <UserRoles
                        selectedClient={ state.selectedClient }
                        userId={ state.userId }
                        updateUserRoles={ updateUserRoles }
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default UserGrants;
