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

import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import { TableDefinition } from 'cucumber';

Then('the roles page is displayed', (data: TableDefinition) => {
    const roles = data.rows().map((row) => row[0]);
    cy.clientRolesPage((clientRolesPage) => {
        clientRolesPage.validatePage(roles);
    });
});

When('I click on the add role button', () => {
    // TODO finish this
});

Then('the role dialog is visible with {string} in the text field', (fieldText: string) => {
    // TODO finish this
});

When('I enter {string} into the text field', (text: string) => {
    // TODO finish this
});

When('I click the {string} button in the roles dialog', (buttonType: string) => {
    // TODO finish this
});

When('I click on the {string} button for role {int}', (buttonType: string, roleIndex: number) => {
    // TODO finish this
});

Then('the role delete dialog is visible', () => {
    // TODO finish this
});

When('I click the {string} button in the role delete dialog', (buttonType: string) => {
    // TODO finish this
});