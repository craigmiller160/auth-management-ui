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

type HomePage = import('./commands/pages/homePage').HomePage;
type NavbarPage = import('./commands/pages/navbarPage').NavbarPage;
type LoginPage = import('./commands/pages/loginPage').LoginPage;
type ClientsPage = import('./commands/pages/client/clientsPage').ClientsPage;
type ClientDetailsPage = import('./commands/pages/client/clientDetailsPage').ClientDetailsPage;
type ClientConfigPage = import('./commands/pages/client/clientConfigPage').ClientConfigPage;
type AlertPage = import('./commands/pages/alertPage').AlertPage;

declare namespace Cypress {
    interface Chainable {
        loginPage(pageFn: (page: LoginPage) => void): Chainable<Element>;
        navbarPage(pageFn: (page: NavbarPage) => void): Chainable<Element>;
        homePage(pageFn: (page: HomePage) => void): Chainable<Element>;
        clientsPage(pageFn: (page: ClientsPage) => void): Chainable<Element>;
        clientDetailsPage(pageFn: (page: ClientDetailsPage) => void): Chainable<Element>;
        clientConfigPage(pageFn: (page: ClientConfigPage) => void): Chainable<Element>;
        alertPage(pageFn: (page: AlertPage) => void): Chainable<Element>;
        doLogin(): Chainable<Element>;
    }
}