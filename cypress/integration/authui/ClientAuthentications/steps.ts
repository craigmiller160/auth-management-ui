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

import { After, And, Before, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { testClient } from '../../../data/client';
import { testUser } from '../../../data/user';

const cleanup = () => {
    cy.task('deleteUser', 'test@gmail.com');
    cy.task('deleteClient', 'Test Client');
};

Before(() => {
    cleanup();
    cy.task('insertClient', testClient)
        .then((clientId: number) =>
            cy.task('insertUser', { user: testUser, clientId }));
});

After(() => {
    cleanup();
});

Then('the authentications page is displayed', () => {
    cy.clientAuthsPage((clientAuthsPage) => {
        clientAuthsPage.validatePage();
    });
});

And('the authentication for {string} is visible', (userEmail: string) => {
    // TODO finish this
});

When('I click the revoke button for authentication {int}', (authIndex: number) => {
    // TODO finish this
});

Then('no authentications are visible', () => {
    // TODO finish this
});