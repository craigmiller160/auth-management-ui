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
import { useHistory } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/es6/pipeable';
import { PageHeader } from '@craigmiller160/react-material-ui-common';
import * as TE from 'fp-ts/es6/TaskEither';
import * as T from 'fp-ts/es6/Task';
import { getAllClients } from '../../../../services/ClientService';
import './Clients.scss';
import { ClientListItem, ClientListResponse } from '../../../../types/client';
import Table, { BodyRow } from '../../../ui/Table';

interface State {
  clients: Array<ClientListItem>;
}

const header = [ 'Name', 'Key' ];

const Clients = () => {
  const history = useHistory();
  const [ state, setState ] = useState<State>({
    clients: []
  });

  useEffect(() => {
    pipe(
      getAllClients(),
      TE.fold<Error, ClientListResponse, Array<ClientListItem>>(
        (): T.Task<Array<ClientListItem>> => T.of([]),
        (data: ClientListResponse): T.Task<Array<ClientListItem>> =>
          T.of(data.clients)
      ),
      T.map((clients: Array<ClientListItem>) => {
        setState({
          clients
        });
      })
    )();
  }, []);

  const newClick = () => history.push('/clients/new');

  const body: Array<BodyRow> = useMemo(
    () =>
      state.clients.map((client) => ({
        id: `${client.name.replaceAll(' ', '-')}-row`,
        click: () => history.push(`/clients/${client.id}`),
        items: [ client.name, client.clientKey ]
      })),
    [ state.clients, history ]
  );

  return (
    <div id="clients-page" className="Clients">
      <PageHeader id="clients-page-header" title="Clients" />
      <Grid container direction="row">
        <Table id="clients-table" header={header} body={body} />
      </Grid>
      <Grid container direction="row" className="actions">
        <Button
          id="new-client-btn"
          variant="contained"
          color="primary"
          onClick={newClick}
        >
          New Client
        </Button>
      </Grid>
    </div>
  );
};

export default Clients;
