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

const validatePage = (roles: Array<string>) => {
    cy.get(SELECT_CLIENT_ROLES)
        .should('exist');
    cy.get(SELECT_CLIENT_ROLES_TITLE)
        .should('have.text', 'Test Client');

    if (roles.length > 0) {
        cy.get(SELECT_CLIENT_ROLES_LIST)
            .should('exist');
        // TODO tests for role items
        cy.get(SELECT_NO_ROLES_MSG)
            .should('not.exist');
    } else {
        cy.get(SELECT_CLIENT_ROLES_LIST)
            .should('not.exist');
        cy.get(SELECT_NO_ROLES_MSG)
            .should('have.text', 'No Roles');
    }
};

const clientRolesPage = {
    validatePage
};

export type ClientRolesPage = typeof clientRolesPage;
export default createPage(clientRolesPage);