import React, { useEffect, useMemo } from 'react';
import { ClientListItem, ClientListResponse } from '../../../../../types/client';
import { UserClient } from '../../../../../types/user';
import { useHistory } from 'react-router';
import { useImmer } from 'use-immer';
import { SectionHeader } from '../../../../ui/Header';
import List, { Item } from '../../../../ui/List';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Business } from '@material-ui/icons';
import { exists, isSome, Option } from 'fp-ts/es6/Option';
import { ConfirmDialog, SelectDialog } from '../../../../ui/Dialog';
import { SelectOption } from '../../../../ui/Form/Autocomplete';
import { pipe } from 'fp-ts/es6/pipeable';
import { addClientToUser, removeClientFromUser } from '../../../../../services/UserService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { getAllClients } from '../../../../../services/ClientService';

interface Props {
    userClients: Array<UserClient>;
    userId: number;
    updateClients: (clients: Array<UserClient>) => void;
    selectedClient: Option<UserClient>;
    selectClient: (client: UserClient) => void;
}

interface State {
    allClients: Array<ClientListItem>;
    showAddClientDialog: boolean;
    showRemoveClientDialog: boolean;
    clientIdToRemove: number;
}

const UserClients = (props: Props) => {
    const {
        userClients,
        userId,
        updateClients,
        selectedClient,
        selectClient
    } = props;

    const history = useHistory();
    const [state, setState] = useImmer<State>({
        allClients: [],
        showAddClientDialog: false,
        showRemoveClientDialog: false,
        clientIdToRemove: 0
    });

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

    const goToClient = (clientId: number) =>
        history.push(`/clients/${clientId}`);

    const removeClientClick = (clientId: number) => {
        setState((draft) => {
            draft.clientIdToRemove = clientId;
            draft.showRemoveClientDialog = true;
        });
    };

    const clientItems: Array<Item> = userClients.map((client) => ({
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
        active: exists((selected: UserClient) => selected.id === client.id)(selectedClient)
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

    const removeClientOnCancel = () =>
        setState((draft) => {
            draft.showRemoveClientDialog = false;
        });

    const removeClientOnConfirm = async () => {
        setState((draft) => {
            draft.showRemoveClientDialog = false;
        });
        const clients = pipe(
            await removeClientFromUser(userId, state.clientIdToRemove),
            getOrElse((): Array<UserClient> => [])
        );
        updateClients(clients);
    };

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
            <ConfirmDialog
                open={ state.showRemoveClientDialog }
                title="Remove Client"
                message="Are you sure you want to remove this client from this user?"
                onConfirm={ removeClientOnConfirm }
                onCancel={ removeClientOnCancel }
            />
        </>
    );
};

export default UserClients;
