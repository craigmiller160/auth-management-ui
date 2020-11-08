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

import { After, Before, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { TableDefinition } from 'cucumber';
import { testClient } from '../../../data/client';

const cleanup = () => {
    cy.task('deleteClient', 'Test Client');
};

Before(() => {
    cleanup();
    cy.task('insertClient', testClient);
});

After(() => {
    cleanup();
});

Then('the roles page is displayed', (data: TableDefinition) => {
    const roles = data.rows().map((row) => row[0]);
    cy.clientRolesPage((clientRolesPage) => {
        clientRolesPage.validatePage(roles);
    });
});

When('I click on the add role button', () => {
    cy.clientRolesPage((clientRolesPage) => {
        clientRolesPage.clickAddRoleButton();
    });
});

Then('the role dialog is visible with {string} in the text field', (fieldText: string) => {
    cy.clientRolesPage((clientRolesPage) => {
        clientRolesPage.validateRoleDialog(fieldText);
    });
});

When('I enter {string} into the text field', (text: string) => {
    cy.clientRolesPage((clientRolesPage) => {
        clientRolesPage.typeRoleInDialog(text);
    });
});

When('I click the {string} button in the roles dialog', (buttonType: string) => {
    cy.clientRolesPage((clientRolesPage) => {
        switch (buttonType) {
            case 'save':
                clientRolesPage.clickRoleDialogSaveBtn();
                break;
            case 'cancel':
                clientRolesPage.clickRoleDialogCancelBtn();
                break;
            default:
                throw new Error(`Invalid button type: ${buttonType}`);
        }
    });
});

When('I click on the {string} button for role {int}', (buttonType: string, roleIndex: number) => {
    cy.clientRolesPage((clientRolesPage) => {
        switch (buttonType) {
            case 'edit':
                clientRolesPage.clickEditRoleBtn(roleIndex);
                break;
            case 'delete':
                clientRolesPage.clickDeleteRoleBtn(roleIndex);
                break;
            default:
                throw new Error(`Invalid button type: ${buttonType}`);
        }
    });
});

Then('the role delete dialog is visible', () => {
    cy.clientRolesPage((clientRolesPage) => {
        clientRolesPage.validateDeleteRoleDialog();
    });
});

When('I click the {string} button in the role delete dialog', (buttonType: string) => {
    cy.clientRolesPage((clientRolesPage) => {
        switch (buttonType) {
            case 'confirm':
                clientRolesPage.clickDeleteConfirmBtn();
                break;
            case 'cancel':
                clientRolesPage.clickDeleteCancelBtn();
                break;
            default:
                throw new Error(`Invalid button type: ${buttonType}`);
        }
    });
});
