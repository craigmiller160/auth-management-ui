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

/// <reference path="../../support/index.d.ts" />

import isMock from '../../util/isMock';

export {}

describe('First Test', () => {
    beforeEach(() => {
        cy.visit('https://localhost:3000');
    });

    it('before login', () => {
        if (!isMock()) {
            cy.navbar('validateLoggedOut')
                .homePage('validatePage');
        }
    });

    it('logging in', () => {
        if (!isMock()) {
            cy.navbar('validateLoggedOut')
                .homePage('validatePage')
                .navbar('clickLogin')
                .loginPage('validatePage')
                .loginPage('login', {
                    username: 'craig@gmail.com',
                    password: 'password'
                });
        }

        cy.navbar('validateLoggedIn')
            .homePage('validatePage');
    });
});