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

import createPage from './createPage';

const SELECT_PAGE_HEADER = '#client-details-page #client-details-page-header';

const SELECT_TABS = '#client-details-page #client-details-tabs';
const SELECT_CLIENT_CONFIG_TAB = '#client-details-page #client-config-tab';
const SELECT_CLIENT_ROLES_TAB = '#client-details-page #client-roles-tab';
const SELECT_CLIENT_GRANTS_TAB = '#client-details-page #client-grants-tab';
const SELECT_CLIENT_AUTHS_TAB = '#client-details-page #client-auths-tab';

// TODO this is going to have to be split up with each tab having it's own page factory

const validatePageCommon = (newClient: boolean = false) => {
    // TODO test for active tab
    cy.get(SELECT_PAGE_HEADER)
        .should('have.text', 'Client Details');
    cy.get(SELECT_TABS)
        .should('exist');
    cy.get(SELECT_CLIENT_CONFIG_TAB)
        .should('have.text', 'Config');

    if (newClient) {
        cy.get(SELECT_CLIENT_ROLES_TAB)
            .should('not.exist');
        cy.get(SELECT_CLIENT_GRANTS_TAB)
            .should('not.exist');
        cy.get(SELECT_CLIENT_AUTHS_TAB)
            .should('not.exist');
    } else {
        cy.get(SELECT_CLIENT_ROLES_TAB)
            .should('have.text', 'Roles');
        cy.get(SELECT_CLIENT_GRANTS_TAB)
            .should('have.text', 'Grants');
        cy.get(SELECT_CLIENT_AUTHS_TAB)
            .should('have.text', 'Authentications');
    }
};

const clientDetailsPage = {
    validatePageCommon
};

export type ClientDetailsPage = typeof clientDetailsPage;
export default createPage(clientDetailsPage);