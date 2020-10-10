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

const SELECT_CLIENT_KEY_FIELD = '#client-config-page #client-key-field';
const SELECT_CLIENT_SECRET_FIELD = '#client-config-page #client-secret-field';
const SELECT_CLIENT_NAME_FIELD = '#client-config-page #client-name-field';
const SELECT_ACCESS_TIME_FIELD = '#client-config-page #access-token-time-field';
const SELECT_REFRESH_TIME_FIELD = '#client-config-page #refresh-token-time-field';
const SELECT_CODE_TIME_FIELD = '#client-config-page #auth-code-time-field';
const SELECT_ENABLED_FIELD = '#client-config-page #enabled-field';

const SELECT_GEN_CLIENT_KEY_BTN = '#client-config-page #client-key-generate-btn';
const SELECT_GEN_CLIENT_SECRET_BTN = '#client-config-page #client-secret-generate-btn';

const SELECT_REDIRECT_URIS_LIST = '#client-config-page #redirect-uris-list';
const SELECT_ADD_REDIRECT_BTN = '#client-config-page #add-redirect-uri-btn';

const SELECT_SAVE_BTN = '#client-config-page #save-btn';
const SELECT_DELETE_BTN = '#client-config-page #delete-btn';

const SELECT_ENABLED_LABEL = '#client-config-page .switch-label .MuiFormControlLabel-label';
const SELECT_CLIENT_NAME_LABEL = '#client-config-page label[for="client-name-field"]';
const SELECT_CLIENT_KEY_LABEL = '#client-config-page label[for="client-key-field"]';
const SELECT_CLIENT_SECRET_LABEL = '#client-config-page label[for="client-secret-field"]';
const SELECT_ACCESS_TIME_LABEL = '#client-config-page label[for="access-token-time-field"]';
const SELECT_REFRESH_TIME_LABEL = '#client-config-page label[for="refresh-token-time-field"]';
const SELECT_CODE_TIME_LABEL = '#client-config-page label[for="auth-code-time-field"]';
const SELECT_REDIRECT_URIS_LABEL = '#client-config-page #redirect-uris-label';

export interface ClientConfigValues {
    clientName: string;
    accessTokenTimeout: number;
    refreshTokenTimeout: number;
    authCodeTimeout: number;
    enabled: boolean;
    redirectUris: Array<string>;
}

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
    cy.get(SELECT_ACCESS_TIME_LABEL)
        .should('have.text', 'Access Token Timeout (Secs)');
    cy.get(SELECT_REFRESH_TIME_LABEL)
        .should('have.text', 'Refresh Token Timeout (Secs)');
    cy.get(SELECT_CODE_TIME_LABEL)
        .should('have.text', 'Auth Code Timeout (Secs)');
    cy.get(SELECT_REDIRECT_URIS_LABEL)
        .should('have.text', 'Redirect URIs');

    cy.get(SELECT_ADD_REDIRECT_BTN)
        .should('have.text', 'Add Redirect URI');

    cy.get(SELECT_SAVE_BTN)
        .should('have.text', 'Save');
    if (!newClient) {
        cy.get(SELECT_DELETE_BTN)
            .should('have.text', 'Delete');
    }

    // Special validation for client secret save  bug
    cy.get(SELECT_CLIENT_SECRET_LABEL)
        .should('have.class', 'MuiInputLabel-shrink')
        .should('have.class', 'MuiFormLabel-filled');
};

const validateClientConfigValues = (values: ClientConfigValues) => {
    cy.get(SELECT_CLIENT_NAME_FIELD)
        .should('have.value', values.clientName);
    cy.get(SELECT_CLIENT_KEY_FIELD)
        .should('not.have.value', ''); // TODO improve this
    cy.get(SELECT_CLIENT_SECRET_FIELD)
        .should('not.have.value', '')
        .should('not.have.value', '**********'); // TODO improve this

    cy.get(SELECT_ACCESS_TIME_FIELD)
        .should('have.value', values.accessTokenTimeout);
    cy.get(SELECT_REFRESH_TIME_FIELD)
        .should('have.value', values.refreshTokenTimeout);
    cy.get(SELECT_CODE_TIME_FIELD)
        .should('have.value', values.authCodeTimeout);

    cy.get(SELECT_ENABLED_FIELD)
        .should('have.class', values.enabled ? 'switch-true' : 'switch-false');

    cy.get(SELECT_REDIRECT_URIS_LIST)
        .should('exist')
        .find('li')
        .should('have.length', values.redirectUris.length)
        .each(($li, index) => {
            expect($li.text()).to.equal(values.redirectUris[index]);
        });
};

const validateNewClientConfigValues = () => { // TODO delete this
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

const validateExistingClientConfigValues = (values: ClientConfigValues) => { // TODO delete this
    // Client Key & Secret are
    cy.get(SELECT_CLIENT_NAME_FIELD)
        .should('have.value', values.clientName);
    cy.get(SELECT_ACCESS_TIME_FIELD)
        .should('have.value', values.accessTokenTimeout);
    cy.get(SELECT_REFRESH_TIME_FIELD)
        .should('have.value', values.refreshTokenTimeout);
    cy.get(SELECT_CODE_TIME_FIELD)
        .should('have.value', values.authCodeTimeout);
    cy.get(SELECT_ENABLED_FIELD)
        .should('have.class', values.enabled ? 'switch-true' : 'switch-false');
    cy.get(SELECT_REDIRECT_URIS_LIST)
        .find('li')
        .should('have.length', values.redirectUris.length)
        .each(($li, index) => {
            expect($li.text()).to.equal(values.redirectUris[index]);
        });
};

const clickSaveBtn = () => {
    cy.get(SELECT_SAVE_BTN).click();
};

const clickDeleteBtn = () => {
    cy.get(SELECT_DELETE_BTN).click();
};

const clientConfigPage = {
    validateClientConfigCommon,
    validateNewClientConfigValues,
    validateExistingClientConfigValues,
    validateClientConfigValues,
    clickSaveBtn,
    clickDeleteBtn
};

export type ClientConfigPage = typeof clientConfigPage;
export default createPage(clientConfigPage);