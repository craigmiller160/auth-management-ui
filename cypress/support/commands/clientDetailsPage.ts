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

const SELECT_REDIRECT_URIS_LIST = '#client-details-page #redirect-uris-list';
const SELECT_ADD_REDIRECT_BTN = '#client-details-page #add-redirect-uri-btn';

const SELECT_SAVE_BTN = '#client-details-page #save-btn';
const SELECT_DELETE_BTN = '#client-details-page #delete-btn';

const SELECT_ENABLED_LABEL = '#client-details-page .switch-label .MuiFormControlLabel-label';
const SELECT_CLIENT_NAME_LABEL = '#client-details-page label[for="client-name-field"]';
const SELECT_CLIENT_KEY_LABEL = '#client-details-page label[for="client-key-field"]';
const SELECT_CLIENT_SECRET_LABEL = '#client-details-page label[for="client-secret-field"]';

// TODO this is going to have to be split up with each tab having it's own page factory

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

const validateClientConfigCommon = (newClient: boolean = false) => {
    cy.get(SELECT_GEN_CLIENT_KEY_BTN)
        .should('have.text', 'Generate');
    cy.get(SELECT_GEN_CLIENT_SECRET_BTN)
        .should('have.text', 'Generate');
    cy.get(SELECT_CLIENT_NAME_LABEL)
        .should('have.text', 'Client Name');
    cy.get(SELECT_CLIENT_KEY_LABEL)
        .should('have.text', 'Client Key');
    cy.get(SELECT_CLIENT_SECRET_LABEL)
        .should('have.text', 'Client Secret');
    cy.get(SELECT_ENABLED_LABEL)
        .should('have.text', 'Enabled');
    // TODO need remaining labels

    cy.get(SELECT_ADD_REDIRECT_BTN)
        .should('have.text', 'Add Redirect URI');

    cy.get(SELECT_SAVE_BTN)
        .should('have.text', 'Save');
    if (!newClient) {
        cy.get(SELECT_DELETE_BTN)
            .should('have.text', 'Delete');
    }

    // TODO validate labels
    // TODO that includes text of Enabled switch
};

const validateNewClientConfigValues = () => {
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
        .should('have.class', 'switch-true');

    cy.get(SELECT_REDIRECT_URIS_LIST)
        .should('exist')
        .find('li')
        .should('have.length', 0);
};

const clientDetailsPage = {
    validatePageCommon,
    validateNewClientConfigValues,
    validateClientConfigCommon
};

export type ClientDetailsPageType = typeof clientDetailsPage;
export default createPage(clientDetailsPage);