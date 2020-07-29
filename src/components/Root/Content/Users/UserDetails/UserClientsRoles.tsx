import React, { useEffect } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import Grid from '@material-ui/core/Grid';
import { FullUserClient } from '../../../../../types/oldApi';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import { useImmer } from 'use-immer';
import { Business } from '@material-ui/icons';
import { Typography } from '@material-ui/core';

interface Props {
    clients: Array<FullUserClient>;
    updateClients: (clients: Array<FullUserClient>) => void;
}

interface State {
    selectedClient?: FullUserClient;
}

// TODO how do I add a new client if I don't have that client's roles

const UserClientsRoles = (props: Props) => {
    const {
        clients,
        updateClients
    } = props;

    const [state, setState] = useImmer<State>({});

    useEffect(() => {
        setState((draft) => {
            draft.selectedClient = undefined;
        });
    }, [clients, setState]);

    const clientClick = (fullClient: FullUserClient) => {
        setState((draft) => {
            draft.selectedClient = fullClient;
        });
    };

    const clientItems: Array<Item> = clients.map((fullClient) => ({
        click: () => clientClick(fullClient),
        avatar: () => <Business />,
        text: {
            primary: fullClient.client.name
        },
        secondaryAction: {
            text: 'Remove',
            click: () => {}
        },
        active: state.selectedClient?.client?.id === fullClient.client.id
    }));

    const roleItems: Array<Item> = state.selectedClient ?
        state.selectedClient.userRoles.map((role) => ({
            click: () => {},
            text: {
                primary: role.name
            },
            secondaryAction: {
                text: 'Remove',
                click: () => {}
            }
        })) : [];

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
        </div>
    );
};

export default UserClientsRoles;
