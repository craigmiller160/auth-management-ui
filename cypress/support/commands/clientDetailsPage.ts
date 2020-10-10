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
const SELECT_CLIENT_KEY_FIELD = '#client-details-page #client-key-field';
const SELECT_CLIENT_SECRET_FIELD = '#client-details-page #client-secret-field';
const SELECT_CLIENT_NAME_FIELD = '#client-details-page #client-name-field';
const SELECT_ACCESS_TIME_FIELD = '#client-details-page #access-token-time-field';
const SELECT_REFRESH_TIME_FIELD = '#client-details-page #refresh-token-time-field';
const SELECT_CODE_TIME_FIELD = '#client-details-page #auth-code-time-field';
const SELECT_ENABLED_FIELD = '#client-details-page #enabled-field';
const SELECT_GEN_CLIENT_KEY_BTN = '#client-details-page #client-key-generate-btn';
const SELECT_GEN_CLIENT_SECRET_BTN = '#client-details-page #client-secret-generate-btn';

const validatePageCommon = (newClient: boolean = false) => {
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

const validateNewClientConfig = () => {
    cy.get(SELECT_GEN_CLIENT_KEY_BTN)
        .should('have.text', 'Generate');
    cy.get(SELECT_GEN_CLIENT_SECRET_BTN)
        .should('have.text', 'Generate');

    cy.get(SELECT_CLIENT_NAME_FIELD)
        .should('have.value', 'New Client');
    cy.get(SELECT_CLIENT_KEY_FIELD)
        .should('not.have.value', '');
    cy.get(SELECT_CLIENT_SECRET_FIELD)
        .should('not.have.value', '')
        .should('not.have.value', '**********');

    cy.get(SELECT_ACCESS_TIME_FIELD)
        .should('have.value', 300);
    cy.get(SELECT_REFRESH_TIME_FIELD)
        .should('have.value', 3600);
    cy.get(SELECT_CODE_TIME_FIELD)
        .should('have.value', 60);

    cy.get(SELECT_ENABLED_FIELD)
        .should('have.value', true);

    // TODO a lot more to do
};

const clientDetailsPage = {
    validatePageCommon,
    validateNewClientConfig
};

export type ClientDetailsPageType = typeof clientDetailsPage;
export default createPage(clientDetailsPage);