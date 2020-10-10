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

/// <reference types="cypress" />

type HomePageType = import('./commands/homePage').HomePageType;

declare namespace Cypress {
    interface Chainable {
        loginPage(key: string, args?: object): Chainable<Element>;
        navbar(key: string, args?: object): Chainable<Element>;
        homePage(pageFn: (page: HomePageType) => void): Chainable<Element>;
    }
}