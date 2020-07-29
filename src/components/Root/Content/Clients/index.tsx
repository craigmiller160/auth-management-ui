import React, { useEffect, useMemo, useState } from 'react';
import { getAllClients } from '../../../../services/ClientService';
import { useHistory } from 'react-router';
import { PageHeader } from '../../../ui/Header';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './Clients.scss';
import Table from '../../../ui/Table';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { ClientListResponse, ClientResponse } from '../../../../types/graphApi';

interface State {
    clients: Array<ClientResponse>;
}

const header = ['Name', 'Key'];

const Clients = () => {
    const history = useHistory();
    const [state, setState] = useState<State>({
        clients: []
    });

    useEffect(() => {
        const action = async () => {
            const clients = pipe(
                await getAllClients(),
                map((list: ClientListResponse) => list.clients),
                getOrElse((): Array<ClientResponse> => ([]))
            );
            setState({
                clients: clients
            });
        };

        action();
    }, []);

    const newClick = () => history.push('/clients/new');

    const body = useMemo(() =>
        state.clients
            .map((client) => ({
                click: () => history.push(`/clients/${client.id}`),
                items: [
                    client.name ?? '',
                    client.clientKey ?? ''
                ]
            })),
    [state.clients, history]);

    return (
        <div className="Clients">
            <PageHeader title="Clients" />
            <Grid
                container
                direction="row"
            >
                <Table
                    header={ header }
                    body={ body }
                />
            </Grid>
            <Grid
                container
                direction="row"
                className="actions"
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ newClick }
                >
                    New Client
                </Button>
            </Grid>
        </div>
    );
};

export default Clients;
