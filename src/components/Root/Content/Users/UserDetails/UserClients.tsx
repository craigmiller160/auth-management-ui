import React, { useEffect, useMemo } from 'react';
import { ClientListItem } from '../../../../../types/client';
import { UserClient } from '../../../../../types/user';
import { useHistory } from 'react-router';
import { useImmer } from 'use-immer';
import { SectionHeader } from '../../../../ui/Header';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Business } from '@material-ui/icons';
import { exists, isSome, Option } from 'fp-ts/es6/Option';
import { SelectDialog } from '../../../../ui/Dialog';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { pipe } from 'fp-ts/es6/pipeable';
import { addClientToUser } from '../../../../../services/UserService';
import { getOrElse } from 'fp-ts/es6/Either';

interface Props {
    userClients: Array<UserClient>;
    userId: number;
    updateClients: (clients: Array<UserClient>) => void;
    selectedClient: Option<UserClient>;
}

interface State {
    allClients: Array<ClientListItem>;
    showAddClientDialog: boolean;
    showRemoveClientDialog: boolean;
}

const UserClients = (props: Props) => {
    const {
        userClients,
        userId,
        updateClients,
        selectedClient
    } = props;

    const history = useHistory();
    const [state, setState] = useImmer<State>({
        allClients: [],
        showAddClientDialog: false,
        showRemoveClientDialog: false
    });

    const clientClick = (client: UserClient) => {
        // TODO handle this
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
        active: exists((client: UserClient) => !!client)(selectedClient)
    }));

    const addClientClick = () =>
        setState((draft) => {
            draft.showAddClientDialog = true;
        });

    const addClientSelect = async (selectedClient: Option<SelectOption<number>>) => {
        setState((draft) => {
            draft.showAddClientDialog = false
        });
        if (isSome(selectedClient)) {
            const clientId = selectedClient.value.value;
            const clients = pipe (
                await addClientToUser(userId, clientId),
                getOrElse((): Array<UserClient> => [])
            );
            updateClients(clients);
        }
    };

    const addClientCancel = () =>
        setState((draft) => {
            draft.showAddClientDialog = false;
        });

    const clientOptions = useMemo(() =>
            state.allClients
                .filter((client) => !userClients.find((otherClient) => client.id === otherClient.id))
                .sort((client1, client2) => client1.name.localeCompare(client2.name))
                .map((client) => ({
                    label: client.name,
                    value: client.id
                })),
        [state.allClients, userClients]);

    return (
        <>
            <SectionHeader title="Clients" />
            <List items={ clientItems } />
            <Button
                color="primary"
                variant="contained"
                onClick={ addClientClick }
            >
                Add Client
            </Button>
            <SelectDialog
                open={ state.showAddClientDialog }
                title="Add Client"
                onSelect={ addClientSelect }
                onCancel={ addClientCancel }
                options={ clientOptions }
            />
        </>
    );
};

export default UserClients;
