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
import { mount, ReactWrapper } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import { GraphQLQueryResponse } from '@craigmiller160/ajax-api-fp-ts';
import { act } from 'react-dom/test-utils';
import ajaxApi from '../../../../../src/services/AjaxApi';
import Clients from '../../../../../src/components/Root/Content/Clients';
import { ClientListResponse } from '../../../../../src/types/client';
import {
    createTestComponent,
    createTestRouter,
    RenderedItem,
    renderingValidator,
    RouterOptions
} from '@craigmiller160/react-test-utils';
import { mockCsrfPreflight } from '@craigmiller160/ajax-api-fp-ts/lib/test-utils';

const mockApi = new MockAdapter(ajaxApi.instance);

const defaultRouterOptions: RouterOptions = {
    initialEntries: [ '/' ],
    initialIndex: 0
};

const TestRouter = createTestRouter(defaultRouterOptions);
const TestClients = createTestComponent({}, Clients);

const response: GraphQLQueryResponse<ClientListResponse> = {
    data: {
        clients: [
            {
                id: 1,
                name: 'Client',
                clientKey: 'Key'
            }
        ]
    }
};

// TODO make this trick re-usable
const doMount = async (): Promise<ReactWrapper> => {
    let component: any;
    await act(async () => {
        component = await mount(
            <TestRouter>
                <TestClients />
            </TestRouter>
        )
    });
    return component as ReactWrapper;
};

const pageHeaderItem: RenderedItem = {
    selector: 'PageHeader',
    values: {
        props: {
            id: 'clients-page-header',
            title: 'Clients'
        }
    }
};

const tableItem: RenderedItem = {
    selector: 'Table',
    values: {
        props: {
            id: 'clients-table',
            header: [
                'Name',
                'Key'
            ],
            body: [
                expect.objectContaining({
                    click: expect.any(Function),
                    items: [
                        'Client',
                        'Key'
                    ]
                })
            ]
        }
    }
};

const newClientBtnItem: RenderedItem = {
    selector: 'Button',
    values: {
        props: {

        }
    }
};

describe('Clients', () => {
    beforeEach(() => {
        mockApi.reset();
        mockCsrfPreflight(mockApi, '/graphql');
        mockApi.onPost('/graphql')
            .reply(200, response);
    });

    describe('rendering', () => {
        it('renders', async () => {
            const component = await doMount();
            component.update();
            console.log(component.debug());

            const items: RenderedItem[] = [
                pageHeaderItem,
                tableItem
            ];

            renderingValidator(component, items);
        });
    });

    describe('behavior', () => {
        it('new client', () => {
            throw new Error();
        });

        it('select client', () => {
            throw new Error();
        });
    })
});