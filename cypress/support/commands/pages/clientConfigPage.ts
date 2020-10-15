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

const CLIENT_KEY = 'clientKey';
const CLIENT_SECRET = 'clientSecret';

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

const SELECT_DELETE_DIALOG = '#client-config-page #delete-client-dialog';
const SELECT_DELETE_DIALOG_TITLE = '#client-config-page #delete-client-dialog h2';
const SELECT_DELETE_DIALOG_BODY = '#client-config-page #delete-client-dialog p';
const SELECT_DELETE_DIALOG_CONFIRM = '#client-config-page #delete-client-dialog #delete-client-dialog-btn-0';
const SELECT_DELETE_DIALOG_CANCEL = '#client-config-page #delete-client-dialog #delete-client-dialog-btn-1';

export interface ClientConfigValues {
    clientName: string;
    accessTokenTimeout: number;
    refreshTokenTimeout: number;
    authCodeTimeout: number;
    enabled: boolean;
    clientSecretHasPlaceholder?: boolean;
    clientKeyValidator?: (value: string) => void;
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

    cy.get(SELECT_REDIRECT_URIS_LIST)
        .should('exist');

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

const getClientKeyField = () => cy.get(SELECT_CLIENT_KEY_FIELD);
const getClientSecretField = () => cy.get(SELECT_CLIENT_SECRET_FIELD);

const validateClientConfigValues = (values: ClientConfigValues) => {
    cy.get(SELECT_CLIENT_NAME_FIELD)
        .should('have.value', values.clientName);
    cy.get(SELECT_CLIENT_KEY_FIELD)
        .should('not.have.value', '');
    cy.get(SELECT_CLIENT_SECRET_FIELD)
        .should('not.have.value', '');

    if (values.clientKeyValidator) {
        cy.get(SELECT_CLIENT_KEY_FIELD)
            .then(($keyField) => {
                const key: string = $keyField.val() as string;
                values.clientKeyValidator(key);
            });
    }

    if (values.clientSecretHasPlaceholder) {
        cy.get(SELECT_CLIENT_SECRET_FIELD)
            .should('have.value', '**********');
    } else {
        cy.get(SELECT_CLIENT_SECRET_FIELD)
            .should('not.have.value', '**********');
    }

    cy.get(SELECT_ACCESS_TIME_FIELD)
        .should('have.value', values.accessTokenTimeout);
    cy.get(SELECT_REFRESH_TIME_FIELD)
        .should('have.value', values.refreshTokenTimeout);
    cy.get(SELECT_CODE_TIME_FIELD)
        .should('have.value', values.authCodeTimeout);

    cy.get(SELECT_ENABLED_FIELD)
        .should('have.class', values.enabled ? 'switch-true' : 'switch-false');
};

const validateRedirectUris = (uris: Array<String>) => {
    cy.get(SELECT_REDIRECT_URIS_LIST)
        .find('li span.MuiTypography-body1')
        .should('have.length', uris.length)
        .each(($li, index) => {
            expect($li.text()).to.equal(uris[index]);
        });
};

const clickSaveBtn = () => {
    cy.get(SELECT_SAVE_BTN).click();
};

const clickDeleteBtn = () => {
    cy.get(SELECT_DELETE_BTN).click();
};

const generateFieldValue = (genFieldName: string) => {
    if (CLIENT_KEY === genFieldName) {
        cy.get(SELECT_CLIENT_KEY_FIELD)
            .then(($keyField) => cy.wrap($keyField.val()).as(CLIENT_KEY));
        cy.get(SELECT_GEN_CLIENT_KEY_BTN).click();
        cy.wait(1000);
        cy.get(SELECT_CLIENT_KEY_FIELD)
            .then(($keyField) => {
                expect($keyField.val()).not.to.equal(cy.get(`@${CLIENT_KEY}`));
            });
    } else if (CLIENT_SECRET === genFieldName) {
        cy.get(SELECT_CLIENT_SECRET_FIELD)
            .then(($keyField) => cy.wrap($keyField.val()).as(CLIENT_SECRET));
        cy.get(SELECT_GEN_CLIENT_SECRET_BTN).click();
        cy.get(SELECT_CLIENT_SECRET_FIELD)
            .then(($keyField) => {
                expect($keyField.val()).not.to.equal(cy.get(`@${CLIENT_SECRET}`));
            });
    } else {
        throw new Error(`Invalid field name to generate value: ${genFieldName}`);
    }
};

const setConfigValues = (values: ClientConfigValues) => {
    cy.get(SELECT_CLIENT_NAME_FIELD)
        .clear()
        .type(values.clientName);
    cy.get(SELECT_ACCESS_TIME_FIELD)
        .clear()
        .type(`${values.accessTokenTimeout}`);
    cy.get(SELECT_REFRESH_TIME_FIELD)
        .clear()
        .type(`${values.refreshTokenTimeout}`);
    cy.get(SELECT_CODE_TIME_FIELD)
        .clear()
        .type(`${values.authCodeTimeout}`);

    cy.get(SELECT_ENABLED_FIELD).click();
};

const clientConfigPage = {
    validateClientConfigCommon,
    validateClientConfigValues,
    clickSaveBtn,
    clickDeleteBtn,
    getClientKeyField,
    getClientSecretField,
    validateRedirectUris,
    generateFieldValue,
    setConfigValues
};

export type ClientConfigPage = typeof clientConfigPage;
export default createPage(clientConfigPage);