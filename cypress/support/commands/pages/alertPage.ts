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

const SELECT_COLLAPSE = '#global-alert-container .MuiCollapse-container';
const SELECT_ALERT = '#global-alert';
const SELECT_ALERT_CLOSE_BTN = '#global-alert-container #global-alert button';
const SELECT_ALERT_TITLE = '#global-alert-container #global-alert-title';
const SELECT_ALERT_MESSAGE = '#global-alert-container #global-alert-message';

const COLLAPSE_VISIBLE_CLASS = 'MuiCollapse-entered';
const COLLAPSE_HIDDEN_CLASS = 'MuiCollapse-hidden';
const ALERT_SUCCESS_CLASS = 'MuiAlert-standardSuccess';
const ALERT_ERROR_CLASS = 'MuiAlert-standardError';

const isVisible = () => {
    cy.get(SELECT_COLLAPSE)
        .should('have.class', COLLAPSE_VISIBLE_CLASS);
};

const isHidden = () => {
    cy.get(SELECT_COLLAPSE)
        .should('have.class', COLLAPSE_HIDDEN_CLASS);
};

const isSuccess = () => {
    cy.get(SELECT_ALERT)
        .should('have.class', ALERT_SUCCESS_CLASS);
    cy.get(SELECT_ALERT_TITLE)
        .should('have.text', 'Success');
};

const isError = () => {
    cy.get(SELECT_ALERT)
        .should('have.class', ALERT_ERROR_CLASS);
    cy.get(SELECT_ALERT_TITLE)
        .should('have.text', 'Error');
};

const messageEquals = (message: string) => {
    cy.get(SELECT_ALERT_MESSAGE)
        .should('have.text', message);
};

const closeAlert = () => {
    cy.get(SELECT_ALERT_CLOSE_BTN).click();
};

const alertPage = {
    isVisible,
    isHidden,
    isSuccess,
    isError,
    messageEquals,
    closeAlert
};

export default createPage(alertPage);