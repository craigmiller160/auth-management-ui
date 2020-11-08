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

import createPage from '../createPage';

const SELECT_CLIENT_ROLES = '#client-roles-page';
const SELECT_CLIENT_ROLES_TITLE = '#client-roles-page #client-roles-title';
const SELECT_CLIENT_ROLES_LIST = '#client-roles-page #client-roles-list';
const SELECT_NO_ROLES_MSG = '#client-roles-page #no-roles-msg';
const SELECT_ROLE_DIALOG = '#client-role-dialog';
const SELECT_DELETE_DIALOG = '#delete-client-role-dialog';
const SELECT_ADD_ROLE_BTN = '#client-roles-page #add-role-btn';

const validatePage = (roles: Array<string>) => {
    cy.get(SELECT_CLIENT_ROLES)
        .should('exist');
    cy.get(SELECT_CLIENT_ROLES_TITLE)
        .should('have.text', 'Test Client');
    cy.get(SELECT_ADD_ROLE_BTN)
        .should('have.text', 'Add Role');

    if (roles.length > 0) {
        cy.get(SELECT_CLIENT_ROLES_LIST)
            .should('exist')
            .find('li')
            .should('have.length', roles.length)
            .each(($li, index) => {
                cy.wrap($li)
                    .find('.MuiListItemText-primary')
                    .should('have.text', roles[index]);
                cy.wrap($li)
                    .find('button')
                    .eq(0)
                    .should('have.text', 'Edit');
                cy.wrap($li)
                    .find('button')
                    .eq(1)
                    .should('have.text', 'Delete');
            });

        cy.get(SELECT_NO_ROLES_MSG)
            .should('not.exist');
    } else {
        cy.get(SELECT_CLIENT_ROLES_LIST)
            .should('not.exist');
        cy.get(SELECT_NO_ROLES_MSG)
            .should('have.text', 'No Roles');
    }
};

const clickAddRoleButton = () => {
    cy.get(SELECT_ADD_ROLE_BTN).click();
};

const validateRoleDialog = (text: string) => {
    cy.get(SELECT_ROLE_DIALOG)
        .should('exist');
    cy.get(SELECT_ROLE_DIALOG)
        .find('input')
        .should('have.value', text);
};

const typeRoleInDialog = (text: string) => {
    cy.get(SELECT_ROLE_DIALOG)
        .find('input')
        .clear()
        .type(text);
};

const clickRoleDialogSaveBtn = () => {
    cy.get(SELECT_ROLE_DIALOG)
        .find('button')
        .eq(0)
        .click();
};

const clickRoleDialogCancelBtn = () => {
    cy.get(SELECT_ROLE_DIALOG)
        .find('button')
        .eq(1)
        .click();
};

const clickEditRoleBtn = (roleIndex: number) => {
    cy.get(SELECT_CLIENT_ROLES_LIST)
        .find('li')
        .eq(roleIndex)
        .find('button')
        .eq(0)
        .click();
};

const clickDeleteRoleBtn = (roleIndex: number) => {
    cy.get(SELECT_CLIENT_ROLES_LIST)
        .find('li')
        .eq(roleIndex)
        .find('button')
        .eq(1)
        .click();
};

const validateDeleteRoleDialog = () => {
    cy.get(SELECT_DELETE_DIALOG)
        .should('exist');
    cy.get(SELECT_DELETE_DIALOG)
        .find('div.MuiDialogTitle-root h2')
        .should('have.text', 'Delete Role');
    cy.get(SELECT_DELETE_DIALOG)
        .find('p')
        .should('have.text', 'Are you sure you want to delete this role?');
    cy.get(SELECT_DELETE_DIALOG)
        .find('button')
        .eq(0)
        .should('have.text', 'Confirm');
    cy.get(SELECT_DELETE_DIALOG)
        .find('button')
        .eq(1)
        .should('have.text', 'Cancel');
};

const clickDeleteConfirmBtn = () => {
    cy.get(SELECT_DELETE_DIALOG)
        .find('button')
        .eq(0)
        .click();
};

const clickDeleteCancelBtn = () => {
    cy.get(SELECT_DELETE_DIALOG)
        .find('button')
        .eq(1)
        .click();
};

const clientRolesPage = {
    validatePage,
    clickAddRoleButton,
    validateRoleDialog,
    typeRoleInDialog,
    clickRoleDialogSaveBtn,
    clickRoleDialogCancelBtn,
    clickEditRoleBtn,
    clickDeleteRoleBtn,
    validateDeleteRoleDialog,
    clickDeleteConfirmBtn,
    clickDeleteCancelBtn
};

export type ClientRolesPage = typeof clientRolesPage;
export default createPage(clientRolesPage);
