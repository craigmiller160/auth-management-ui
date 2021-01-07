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
import ajaxApi from '../../../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { mockCsrfPreflight } from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import { enzymeAsyncMount } from '@craigmiller160/react-test-utils';
import { Router, withRouter } from 'react-router';
import ClientConfig from '../../../../../../src/components/Root/Content/Clients/ClientDetails/ClientConfig';

const mockApi = new MockAdapter(ajaxApi.instance);

const ClientConfigWithRouter = withRouter(ClientConfig);

const doMount = (history: MemoryHistory) => enzymeAsyncMount(
    <Router history={ history }>
        <ClientConfigWithRouter />
    </Router>
);

describe('ClientConfig', () => {
    let testHistory: MemoryHistory;
    beforeEach(() => {
        mockApi.reset();
        mockCsrfPreflight(mockApi, '/graphql');
        testHistory = createMemoryHistory();
    });

    describe('rendering', () => {
        it('renders for new client', () => {
            testHistory.push('/clients/new');
            throw new Error();
        });

        it('renders for existing client', () => {
            testHistory.push('/clients/1');
            throw new Error();
        });
    });

    describe('behavior', () => {
        it('generateClientKey', () => {
            throw new Error();
        });

        it('generateClientSecret', () => {
            throw new Error();
        });

        it('successfully leave page', () => {
            throw new Error();
        });

        it('stop leaving page', () => {
            throw new Error();
        });

        it('add redirect uri', () => {
            throw new Error();
        });

        it('edit redirect uri', () => {
            throw new Error();
        });

        it('save client', () => {
            throw new Error();
        });

        it('execute delete client', () => {
            throw new Error();
        });

        it('cancel redirect uri', () => {
            throw new Error();
        });

        it('save redirect uri', () => {
            throw new Error();
        });

        it('delete redirect uri', () => {
            throw new Error();
        });

        it('show delete dialog', () => {
            throw new Error();
        });

        it('hide delete dialog', () => {
            throw new Error();
        });
    });
});
