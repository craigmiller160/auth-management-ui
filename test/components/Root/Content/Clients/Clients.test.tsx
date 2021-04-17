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

import React from 'react';
import { ReactWrapper } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory, MemoryHistory } from 'history';
import { GraphQLQueryResponse } from '@craigmiller160/ajax-api-fp-ts';
import {
  enzymeAsyncMount,
  RenderedItem,
  renderingValidator,
} from '@craigmiller160/react-test-utils';
import { mockCsrfPreflight } from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';
import { Router } from 'react-router';
import ajaxApi from '../../../../../src/services/AjaxApi';
import Clients from '../../../../../src/components/Root/Content/Clients';
import { ClientListResponse } from '../../../../../src/types/client';
import { BodyRow } from '../../../../../src/components/ui/Table';

const mockApi = new MockAdapter(ajaxApi.instance);

const response: GraphQLQueryResponse<ClientListResponse> = {
  data: {
    clients: [
      {
        id: 1,
        name: 'Client',
        clientKey: 'Key',
      },
    ],
  },
};

const doMount = (history: MemoryHistory): Promise<ReactWrapper> =>
  enzymeAsyncMount(
    <Router history={history}>
      <Clients />
    </Router>,
  );

const pageHeaderItem: RenderedItem = {
  selector: 'PageHeader',
  values: {
    props: {
      id: 'clients-page-header',
      title: 'Clients',
    },
  },
};

const tableItem: RenderedItem = {
  selector: 'Table',
  values: {
    props: {
      id: 'clients-table',
      header: [ 'Name', 'Key' ],
      body: [
        expect.objectContaining({
          click: expect.any(Function),
          items: [ 'Client', 'Key' ],
        }),
      ],
    },
  },
};

const newClientBtnItem: RenderedItem = {
  selector: 'ForwardRef(Button)',
  values: {
    props: {
      onClick: expect.any(Function),
    },
    text: 'New Client',
  },
};

describe('Clients', () => {
  let testHistory: MemoryHistory;
  beforeEach(() => {
    testHistory = createMemoryHistory();
    mockApi.reset();
    mockCsrfPreflight(mockApi, '/graphql');
    mockApi.onPost('/graphql').reply(200, response);
  });

  describe('rendering', () => {
    it('renders', async () => {
      const component = await doMount(testHistory);

      const items: RenderedItem[] = [
        pageHeaderItem,
        tableItem,
        newClientBtnItem,
      ];

      renderingValidator(component, items);
    });
  });

  describe('behavior', () => {
    it('new client', async () => {
      const component = await doMount(testHistory);
      component.find('button#new-client-btn').simulate('click');
      expect(testHistory).toHaveLength(2);
      expect(testHistory.entries[1].pathname).toEqual('/clients/new');
    });

    it('select client', async () => {
      const component = await doMount(testHistory);
      const body = (component.find('Table').props() as any).body as BodyRow[];
      body[0].click();
      expect(testHistory).toHaveLength(2);
      expect(testHistory.entries[1].pathname).toEqual('/clients/1');
    });
  });
});
