import React, { useEffect, useMemo, useState } from 'react';
import { Client } from '../../../../types/api';
import { getClients } from '../../../../services/ClientService';
import { isSome } from 'fp-ts/es6/Option';
import { useHistory } from 'react-router';
import { PageHeader } from '../../../ui/Header';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './Clients.scss';
import Table from '../../../ui/Table';

interface State {
    clients: Array<Client>
}

const header = ['Name', 'Key'];

const Clients = () => {
    const history = useHistory();
    const [state, setState] = useState<State>({
        clients: []
    });

    useEffect(() => {
        const action = async () => {
            const result = await getClients();
            if (isSome(result)) {
                setState({
                    clients: result.value.clients
                });
            } else {
                setState({
                    clients: []
                });
            }
        };

        action();
    }, []);

    const newClick = () => history.push('/clients/new');

    const body = useMemo(() => {
        return state.clients.map((client) => ({
            click: () => history.push(`/clients/${client.id}`),
            items: [client.name, client.clientKey]
        }));
    },[state.clients, history]);

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
