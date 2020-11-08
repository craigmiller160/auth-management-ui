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

import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

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

When('I click on the {string} tab', (tabName: string) => {
    cy.clientDetailsPage((clientDetailsPage) => {
        switch (tabName) {
            case 'Config':
                clientDetailsPage.clickTab(0);
                break;
            case 'Roles':
                clientDetailsPage.clickTab(1);
                break;
            case 'Grants':
                clientDetailsPage.clickTab(2);
                break;
            case 'Authentications':
                clientDetailsPage.clickTab(3);
                break;
            default:
                throw new Error(`Invalid tab name: ${tabName}`);
        }
    });
});

When('I click on the client named {string}', (clientName: string) => {
    cy.clientsPage((clientsPage) => {
        clientsPage.clickClientRow(clientName);
    });
});
