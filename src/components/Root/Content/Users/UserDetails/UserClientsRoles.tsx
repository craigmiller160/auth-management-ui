import React, { useEffect } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import Grid from '@material-ui/core/Grid';
import { FullUserClient } from '../../../../../types/api';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import { useImmer } from 'use-immer';
import { Business } from '@material-ui/icons';

interface Props {
    clients: Array<FullUserClient>;
}

interface State {
    selectedClient?: FullUserClient;
}

const UserClientsRoles = (props: Props) => {
    const {
        clients
    } = props;

    const [state, setState] = useImmer<State>({});

    useEffect(() => {
        setState((draft) => {
            draft.selectedClient = undefined;
        });
    }, [clients, setState]);

    const clientItems: Array<Item> = clients.map((fullClient) => ({
        click: () => {},
        avatar: () => <Business />,
        text: {
            primary: fullClient.client.name
        },
        secondaryAction: {
            text: 'Remove',
            click: () => {}
        }
    }));

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
                    </Grid>
                }
            </Grid>
        </div>
    );
};

export default UserClientsRoles;
