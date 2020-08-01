import React, { useEffect, useMemo } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import Grid from '@material-ui/core/Grid';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import { useImmer } from 'use-immer';
import { Business } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { UserClient } from '../../../../../types/user';
import { useHistory } from 'react-router';
import { ClientListItem, ClientListResponse } from '../../../../../types/client';
import { getAllClients } from '../../../../../services/ClientService';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { SelectDialog } from '../../../../ui/Dialog';
import { isSome, Option } from 'fp-ts/es6/Option';
import { SelectOption } from '../../../../ui/Form/Autocomplete';

interface Props {
    userClients: Array<UserClient>;
    updateClients: (clients: Array<UserClient>) => void;
}

interface State {
    selectedClient?: UserClient;
    allClients: Array<ClientListItem>;
    showAddClientDialog: boolean;
    showRemoveClientDialog: boolean;
}

const UserClientsRoles = (props: Props) => {
    const {
        userClients,
        updateClients
    } = props;
    const history = useHistory();
    const [state, setState] = useImmer<State>({
        allClients: [],
        showAddClientDialog: false,
        showRemoveClientDialog: false
    });

    useEffect(() => {
        setState((draft) => {
            draft.selectedClient = undefined;
        });
    }, [userClients, setState]);

    useEffect(() => {
        const action = async () => {
            const clients = pipe(
                await getAllClients(),
                map((res: ClientListResponse) => res.clients),
                getOrElse((): Array<ClientListItem> => [])
            );

            setState((draft) => {
                draft.allClients = clients;
            });
        };

        action();
    }, [setState]);

    const clientClick = (client: UserClient) => {
        setState((draft) => {
            draft.selectedClient = client;
        });
    };

    const goToClient = (clientId: number) =>
        history.push(`/clients/${clientId}`);

    const clientItems: Array<Item> = userClients.map((client) => ({
        click: () => clientClick(client),
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
                click: () => {}
            }
        ],
        active: state.selectedClient?.id === client.id
    }));

    const roleItems: Array<Item> = state.selectedClient?.userRoles
        .map((role) => ({
            click: () => {},
            text: {
                primary: role.name
            },
            secondaryActions: [
                {
                    text: 'Remove',
                    click: () => {}
                }
            ]
        })) ?? [];

    const clientOptions = useMemo(() =>
            state.allClients
                .filter((client) => !userClients.find((otherClient) => client.id === otherClient.id))
                .sort((client1, client2) => client1.name.localeCompare(client2.name))
                .map((client) => ({
                    label: client.name,
                    value: client.id
                })),
        [state.allClients, userClients]);

    const addClientClick = () =>
        setState((draft) => {
            draft.showAddClientDialog = true;
        });

    const addClientSelect = (selectedClient: Option<SelectOption<number>>) => {
        setState((draft) => {
            draft.showAddClientDialog = false
        });
        if (isSome(selectedClient)) {
            const clientId = selectedClient.value.value;
            // TODO finish this
        }
    };

    const addClientCancel = () =>
        setState((draft) => {
            draft.showAddClientDialog = false;
        });

    return (
        <div>
            <Grid
                container
                direction="row"
            >
                <Grid item md={ 5 }>
                    <SectionHeader title="Clients" />
                    <List items={ clientItems } />
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={ addClientClick }
                    >
                        Add Client
                    </Button>
                </Grid>
                <Grid item md={ 2 } />
                {
                    state.selectedClient &&
                    <Grid item md={ 5 }>
                        <SectionHeader title="Roles" />
                        {
                            state.selectedClient.allRoles.length === 0 &&
                            <Typography variant="h6">No Roles</Typography>
                        }
                        {
                            state.selectedClient.allRoles.length > 0 &&
                            <>
                                <List items={ roleItems } />
                                <Button
                                    color="primary"
                                    variant="contained"
                                >
                                    Add Role
                                </Button>
                            </>
                        }
                    </Grid>
                }
            </Grid>
            <SelectDialog
                open={ state.showAddClientDialog }
                title="Add Client"
                onSelect={ addClientSelect }
                onCancel={ addClientCancel }
                options={ clientOptions }
            />
        </div>
    );
};

export default UserClientsRoles;
