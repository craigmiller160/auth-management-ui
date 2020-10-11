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

import { And, Then, When, After } from 'cypress-cucumber-preprocessor/steps';
import { Before, TableDefinition } from 'cucumber';
import { TAB_INDEX_CONFIG } from '../../../support/commands/pages/clientDetailsPage';
import { ClientConfigValues } from '../../../support/commands/pages/clientConfigPage';

const CLIENT_KEY = 'clientKey';
const isNewClient = (clientType: string) => 'new' === clientType;

const cleanup = () => {
    cy.task('deleteClient', 'New Client');
    cy.task('deleteClient', 'Test Client');
};

Before(() => {
    cleanup();
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

And('the client config tab is selected with these values for {string} client', (clientType: string, data: TableDefinition) => {
    const values: ClientConfigValues = data.rows()
        .map((row): ClientConfigValues => ({
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
        }))[0];

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

Then('the client {string} is saved successfully', (clientId: string) => {
    cy.alertPage((alertPage) => {
        alertPage.isVisible();
        alertPage.isSuccess();
        alertPage.messageEquals(`Successfully saved client ${clientId}`);
        alertPage.closeAlert();
    });
});

And('the list contains a client with the name {string}', (clientName: string) => {
    cy.clientsPage((clientsPage) => {
        clientsPage.clientRecordExists(clientName);
    });
});

And('the client config page contains these redirect uris', (data: TableDefinition) => {
    const uris: Array<string> = data.rows()
        .map((row) => row[0]);
    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.validateRedirectUris(uris);
    });
});

