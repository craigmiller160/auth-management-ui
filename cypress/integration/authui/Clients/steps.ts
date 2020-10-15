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

/// <reference path="../../../support/index.d.ts" />

import { And, Then, When, After, Before } from 'cypress-cucumber-preprocessor/steps';
import { TableDefinition } from 'cucumber';
import { TAB_INDEX_CONFIG } from '../../../support/commands/pages/client/clientDetailsPage';
import { ClientConfigValues } from '../../../support/commands/pages/client/clientConfigPage';
import { InsertClient } from '../../../plugins/sql/insertClient';

const CLIENT_KEY = 'clientKey';
const isNewClient = (clientType: string) => 'new' === clientType;

const cleanup = () => {
    cy.task('deleteClient', 'New Client');
    cy.task('deleteClient', 'Test Client');
    cy.task('deleteClient', 'Test Client 2');
};

const testClient: InsertClient = {
    name: 'Test Client',
    clientKey: 'ABCDEFG',
    clientSecret: '{bcrypt}$2a$10$HYKpEK6BFUFH99fHm5yOhuk4hn1gFErtLveeonVSHW1G7n5bUhGUe',
    enabled: false,
    accessTokenTimeout: 10,
    refreshTokenTimeout: 20,
    authCodeTimeout: 30,
    redirectUris: [
        'https://localhost:123/authcode'
    ]
};

Before(() => {
    cleanup();
    cy.task('insertClient', testClient);
});

After(() => {
    cleanup();
});

And('I click on the clients link', () => {
    cy.navbarPage((navbarPage) => {
        navbarPage.clickClients();
    });
});

Then('I am on the clients page', () => {
    cy.clientsPage((clientsPage) => {
        clientsPage.validatePage();
    });
});

When('I click the new client button', () => {
    cy.clientsPage((clientsPage) => {
        clientsPage.clickNewClientBtn();
    });
});

Then('I am on the client details page for a {string} client', (clientType: string) => {
    cy.clientDetailsPage((clientDetailsPage) => {
        clientDetailsPage.validatePageCommon(isNewClient(clientType));
    });
});

const createClientKeyValidator = (row: Array<string>): ClientConfigValues => ({
    clientName: row[0],
    accessTokenTimeout: parseInt(row[1]),
    refreshTokenTimeout: parseInt(row[2]),
    authCodeTimeout: parseInt(row[3]),
    enabled: row[4] === 'true',
    clientSecretHasPlaceholder: row[5] === 'true',
    clientKeyValidator: (value: string) => {
        if (row[6] === 'true') {
            cy.get(`@${CLIENT_KEY}`)
                .then(($key) => expect($key).to.equal(value));
        } else if(row[7]) {
            expect(row[7]).to.equal(value);
        } else {
            expect('').not.to.equal(value);
        }
    }
});

And('the client config tab is selected with these values for {string} client', (clientType: string, data: TableDefinition) => {
    const values: ClientConfigValues = data.rows()
        .map(createClientKeyValidator)[0];

    cy.clientDetailsPage((clientDetailsPage) => {
        clientDetailsPage.isTabSelected(TAB_INDEX_CONFIG);
    })
        .clientConfigPage((clientConfigPage) => {
            clientConfigPage.validateClientConfigCommon(isNewClient(clientType));
            clientConfigPage.validateClientConfigValues(values);
            clientConfigPage.getClientKeyField()
                .then(($key) => cy.wrap($key.val()).as(CLIENT_KEY));
        });
});

When('I click the save button', () => {
    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.clickSaveBtn();
    });
});

And('the list {string} contain a client with the name {string}', (action: string, clientName: string) => {
    cy.clientsPage((clientsPage) => {
        if ('does' === action) {
            clientsPage.clientRecordExists(clientName, true);
        } else if('does not' === action) {
            clientsPage.clientRecordExists(clientName, false);
        } else {
            throw new Error(`Invalid action: ${action}`);
        }
    });
});

And('the client config page contains these redirect uris', (data: TableDefinition) => {
    const uris: Array<string> = data.rows()
        .map((row) => row[0]);
    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.validateRedirectUris(uris);
    });
});

When('I click on the client named {string}', (clientName: string) => {
    cy.clientsPage((clientsPage) => {
        clientsPage.clickClientRow(clientName);
    });
});

Then('I generate a new client {string}', (genFieldName: string) => {
    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.generateFieldValue(genFieldName);
        if (CLIENT_KEY === genFieldName) {
            clientConfigPage.getClientKeyField()
                .then(($key) => {
                    cy.wrap($key.val()).as(CLIENT_KEY);
                });
        }
    });
});

Then('I set the following client config values', (data: TableDefinition) => {
    const values: ClientConfigValues = data.rows()
        .map(createClientKeyValidator)[0];
    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.setConfigValues(values);
    });
});

When('I click the delete button, and confirm the prompt', () => {
    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.clickDeleteBtn();
        clientConfigPage.validateDeleteDialog(true);
        clientConfigPage.clickDeleteCancel();
        clientConfigPage.validateDeleteDialog(false);
        clientConfigPage.clickDeleteBtn();
        clientConfigPage.clickDeleteConfirm();
    });
});

