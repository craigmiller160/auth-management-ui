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
import { TableDefinition } from 'cucumber';
import { TAB_INDEX_CONFIG } from '../../../support/commands/pages/clientDetailsPage';
import { ClientConfigValues } from '../../../support/commands/pages/clientConfigPage';

const CLIENT_TO_DELETE_NAME = 'clientToDeleteName';
const isNewClient = (clientType: string) => 'new' === clientType;

After(() => {
    cy.get(`@${CLIENT_TO_DELETE_NAME}`)
        .then(($name) => cy.task('deleteClient', $name));
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
    // TODO delete this after determining order
    console.log(clientType);
    console.log(data);

    const values: ClientConfigValues = data.rows()
        .map((row): ClientConfigValues => ({
            clientName: row[0],
            accessTokenTimeout: parseInt(row[1]),
            refreshTokenTimeout: parseInt(row[2]),
            authCodeTimeout: parseInt(row[3]),
            enabled: row[4] === 'true',
            clientSecretHasPlaceholder: row[5] === 'true',
            redirectUris: []
        }))[0];

    cy.wrap(values.clientName).as(CLIENT_TO_DELETE_NAME);

    cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.validateClientConfigCommon(isNewClient(clientType));
        clientConfigPage.validateClientConfigValues(values);
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


/*
cy.clientConfigPage((clientConfigPage) => {
        clientConfigPage.validateClientConfigCommon(false);
        clientConfigPage.validateExistingClientConfigValues(postSaveNewClientValues);
    })
 */

