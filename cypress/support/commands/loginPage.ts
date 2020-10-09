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


const SELECT_NAVBAR_BRAND = '#oauth2-login-page a.navbar-brand strong';
const SELECT_USERNAME_LABEL = '#oauth2-login-page label[for="username"]';
const SELECT_USERNAME_FIELD = '#oauth2-login-page input#username';
const SELECT_PASSWORD_LABEL = '#oauth2-login-page label[for="password"]';
const SELECT_PASSWORD_FIELD = '#oauth2-login-page input#password';
const SELECT_SUBMIT_BTN = '#oauth2-login-page #submitBtn';

const login = ({ username, password }: { username: string, password: string }) => {
    cy.get(SELECT_USERNAME_FIELD)
        .type(username);
    cy.get(SELECT_PASSWORD_FIELD)
        .type(password);
    cy.get(SELECT_SUBMIT_BTN)
        .click();
};

const validatePage = () => {
    cy.get(SELECT_NAVBAR_BRAND)
        .should('have.text', 'OAuth2 Login');
    cy.get(SELECT_USERNAME_LABEL)
        .should('have.text', 'Username');
    cy.get(SELECT_USERNAME_FIELD)
        .should('be.visible');
    cy.get(SELECT_PASSWORD_LABEL)
        .should('have.text', 'Password');
    cy.get(SELECT_PASSWORD_FIELD)
        .should('be.visible');
    cy.get(SELECT_SUBMIT_BTN)
        .should('have.text', 'Login');
};

const loginPage = {
    login,
    validatePage
};

export default (key: string, args?: object) => {
    const action = loginPage[key];
    if (action) {
        action(args);
    } else {
        throw new Error(`No such action: ${key}`);
    }
}