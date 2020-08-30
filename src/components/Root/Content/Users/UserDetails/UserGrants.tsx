import React, { useEffect, useMemo } from 'react';
import { match } from 'react-router';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getUserClients } from '../../../../../services/UserService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { UserClient, UserClients } from '../../../../../types/user';
import { Grid, Typography } from '@material-ui/core';
import './UserGrants.scss';
import { SectionHeader } from '../../../../ui/Header';
import { ClientListItem, ClientListResponse } from '../../../../../types/client';
import { getAllClients } from '../../../../../services/ClientService';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { Item } from '../../../../ui/List';
import { Business } from '@material-ui/icons';
import { exists, none, Option, some } from 'fp-ts/es6/Option';

interface State {
    userId: number;
    user: UserClients;
    allClients: Array<ClientListItem>;
    selectedClient: Option<UserClient>;
}
const NEW = 'new';
interface MatchParams {
    id: string;
}
interface Props {
    match: match<MatchParams>;
}

const defaultUser: UserClients = {
    id: 0,
    email: '',
    clients: []
};

const UserGrants = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        user: defaultUser,
        allClients: [],
        selectedClient: none
    });

    useEffect(() => {
        const loadUser = async () => {
            const user = pipe(
                await getUserClients(state.userId),
                getOrElse((): UserClients => defaultUser)
            );
            setState((draft) => {
                draft.user = user;
            });
        };

        const loadAllClients = async () => {
            const allClients = pipe(
                await getAllClients(),
                map((res: ClientListResponse) => res.clients),
                getOrElse((): Array<ClientListItem> => [])
            );
            setState((draft) => {
                draft.allClients = allClients;
            });
        };

        loadUser();
        loadAllClients();
    }, [state.userId, setState]);

    const selectClient = (client: UserClient) =>
        setState((draft) => {
            draft.selectedClient = some(client);
        });

    const clientOptions: Array<SelectOption<number>> = useMemo(() =>
            state.allClients
                .filter((client) => !state.user.clients.find((otherClient) => client.id === otherClient.id))
                .sort((client1, client2) => client1.name.localeCompare(client2.name))
                .map((client) => ({
                    label: client.name,
                    value: client.id
                })),
        [state.allClients, state.user.clients]);

    const goToClient = (clientId: number) => {
        // TODO finish this
    };

    const removeClientClick = (clientId: number) => {
        // TODO finish this
    };

    const clientItems: Array<Item> = state.user.clients.map((client) => ({
        click: () => selectClient(client),
        avatar: () => <Business />,
        text: {
            primary: client.name
        },
        secondaryActions: [
            {
                text: 'Go',
                click: () => goToClient(client.id)
            },
            {
                text: 'Remove',
                click: () => removeClientClick(client.id)
            }
        ],
        active: exists((selected: UserClient) => selected.id === client.id)(state.selectedClient)
    }));

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
                    <SectionHeader title="Clients" />
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
