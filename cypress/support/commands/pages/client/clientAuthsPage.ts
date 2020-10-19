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

const SELECT_CLIENT_AUTHS = '#client-auths-page';
const SELECT_CLIENT_AUTHS_TITLE = '#client-auths-page #client-auths-title';
const SELECT_CLIENT_AUTHS_LIST = '#client-auths-page #client-auths-list';
const SELECT_NO_AUTHS_MSG = '#client-auths-page #no-auths-msg';

const validatePage = (userEmails: Array<string>) => {
    cy.get(SELECT_CLIENT_AUTHS)
        .should('exist');
    cy.get(SELECT_CLIENT_AUTHS_TITLE)
        .should('have.text', 'Test Client');

    if (userEmails.length > 0) {
        cy.get(SELECT_CLIENT_AUTHS_LIST)
            .should('exist')
            .find('li')
            .should('have.length', userEmails.length)
            .each(($li, index) => {
                cy.wrap($li)
                    .find('.MuiListItemText-primary')
                    .should('have.text', `User: ${userEmails[index]}`);
                cy.wrap($li)
                    .find('.MuiListItemText-secondary')
                    .should('contain.text', 'Last Authenticated');
                cy.wrap($li)
                    .find('button')
                    .should('have.text', 'Revoke');
            });
        cy.get(SELECT_NO_AUTHS_MSG)
            .should('not.exist');
    } else {
        cy.get(SELECT_CLIENT_AUTHS_LIST)
            .should('not.exist');
        cy.get(SELECT_NO_AUTHS_MSG)
            .should('have.text', 'No Authorizations');
    }
};

const clickRevokeAuthBtn = (authIndex: number) => {
    cy.get(SELECT_CLIENT_AUTHS_LIST)
        .find('li')
        .eq(authIndex)
        .find('button')
        .click();
};

const clientAuthsPage = {
    validatePage,
    clickRevokeAuthBtn
};

export type ClientAuthsPage = typeof clientAuthsPage;
export default createPage(clientAuthsPage);

