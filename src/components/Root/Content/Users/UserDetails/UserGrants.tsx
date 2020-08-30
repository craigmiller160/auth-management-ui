import React, { useEffect, useMemo } from 'react';
import { match } from 'react-router';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getUserClients } from '../../../../../services/UserService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { UserClient, UserClients as UserClientsType } from '../../../../../types/user';
import { Grid, Typography } from '@material-ui/core';
import './UserGrants.scss';
import { SectionHeader } from '../../../../ui/Header';
import { ClientListItem, ClientListResponse } from '../../../../../types/client';
import { getAllClients } from '../../../../../services/ClientService';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { Item } from '../../../../ui/List';
import { Business } from '@material-ui/icons';
import { exists, none, Option, some } from 'fp-ts/es6/Option';
import UserClients from './UserClients';

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

    const loadUser = async () => {
        const user = pipe(
            await getUserClients(state.userId),
            getOrElse((): UserClientsType => defaultUser)
        );
        setState((draft) => {
            draft.user = user;
        });
    };

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const selectClient = (client: UserClient) =>
        setState((draft) => {
            draft.selectedClient = some(client);
        });

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
                    <SectionHeader title="Roles" />
                </Grid>
            </Grid>
        </div>
    );
};

export default UserGrants;
