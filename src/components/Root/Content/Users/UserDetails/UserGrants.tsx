import React, { useCallback, useEffect } from 'react';
import { match } from 'react-router';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getUserClients } from '../../../../../services/UserService';
import { getOrElse } from 'fp-ts/es6/Either';
import { UserClient, UserClients as UserClientsType, UserRole } from '../../../../../types/user';
import { Grid, Typography } from '@material-ui/core';
import './UserGrants.scss';
import { getOrElse as oGetOrElse, map, none, Option, some } from 'fp-ts/es6/Option';
import UserClients from './UserClients';
import UserRoles from './UserRoles';
import {Item} from "../../../../ui/List";

interface State {
    userId: number;
    user: UserClientsType;
    selectedClient: Option<UserClient>;
}
const NEW = 'new';
interface MatchParams {
    id: string;
}
interface Props {
    match: match<MatchParams>;
}

const defaultUser: UserClientsType = {
    id: 0,
    email: '',
    clients: []
};

const UserGrants = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        user: defaultUser,
        selectedClient: none
    });

    const loadUser = useCallback(async () => {
        const user = pipe(
            await getUserClients(state.userId),
            getOrElse((): UserClientsType => defaultUser)
        );
        setState((draft) => {
            draft.user = user;
        });
    }, [state.userId, setState]);

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
    }

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const selectClient = (client: UserClient) =>
        setState((draft) => {
            draft.selectedClient = some(client);
        });

    // const redirectUris: Array<Item> = [
    //     {
    //
    //     }
    // ];

    return (
        <div className="UserGrants">
            <Typography
                className="email"
                variant="h5"
            >
                { state.user.email }
            </Typography>
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
