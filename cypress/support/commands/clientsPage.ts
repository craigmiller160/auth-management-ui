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

const SELECT_PAGE_HEADER = '#clients-page #clients-page-header';
const SELECT_CLIENTS_TABLE = '#clients-page #clients-table'

const validatePage = () => {
    cy.get(SELECT_PAGE_HEADER)
        .should('have.text', 'Clients');
    cy.get(SELECT_CLIENTS_TABLE)
        .should('exist');
    cy.get(SELECT_CLIENTS_TABLE)
        .children('th.MuiTableCell-head')
        .should('have.length', 2)
        .each(($child) => console.log($child)); // TODO figure this out
};

const clientsPage = {
    validatePage
};

export type ClientsPageType = typeof clientsPage;
export default createPage(clientsPage);
