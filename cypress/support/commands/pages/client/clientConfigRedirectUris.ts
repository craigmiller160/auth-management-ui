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

const SELECT_REDIRECT_URIS_LIST = '#client-config-page #redirect-uris-list';
const SELECT_ADD_REDIRECT_BTN = '#client-config-page #add-redirect-uri-btn';

const SELECT_REDIRECT_DIALOG = '#redirect-uri-dialog';

const validateRedirectDialog = (showDialog: boolean) => {
    // TODO finish this
};

const validateRedirectList = (uris: Array<String>) => {
    cy.get(SELECT_REDIRECT_URIS_LIST)
        .should('exist');

    cy.get(SELECT_ADD_REDIRECT_BTN)
        .should('have.text', 'Add Redirect URI');

    cy.get(SELECT_REDIRECT_URIS_LIST)
        .find('li')
        .should('have.length', uris.length)
        .each(($li, index) => {
            cy.wrap($li)
                .find('.MuiListItemText-primary')
                .should('have.text', uris[index]);
            cy.wrap($li)
                .find('button')
                .should('have.length', 2)
                .each(($btn, index) => {
                    if (index === 0) {
                        cy.wrap($btn)
                            .should('have.text', 'Edit');
                    } else {
                        cy.wrap($btn)
                            .should('have.text', 'Remove');
                    }
                });
        });
};

const typeUriInDialog = (uri: string) => {
    // TODO finish this
};

const clientConfigRedirectUris = {
    validateRedirectDialog,
    typeUriInDialog,
    validateRedirectList
};

export type ClientConfigRedirectUris = typeof clientConfigRedirectUris;
export default createPage(clientConfigRedirectUris);