/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
import { ClientListItem, ClientListResponse } from '../../../../types/client';

interface State {
    clients: Array<ClientListItem>;
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
                getOrElse((): Array<ClientListItem> => ([]))
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
                    client.name,
                    client.clientKey
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
