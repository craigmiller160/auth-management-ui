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
type ClientConfigDeleteDialog = import('./commands/pages/client/clientConfigDeleteDialog').ClientConfigDeleteDialog;
type ClientConfigRedirectUris = import('./commands/pages/client/clientConfigRedirectUris').ClientConfigRedirectUris;
type ClientAuthsPage = import('./commands/pages/client/clientAuthsPage').ClientAuthsPage;
type ClientRolesPage = import('./commands/pages/client/clientRolesPage').ClientRolesPage;
type ClientGrantsPage = import('./commands/pages/client/clientGrantsPage').ClientGrantsPage;
type AlertPage = import('./commands/pages/alertPage').AlertPage;

type PageFunction<T> = (page: T) => void;

declare namespace Cypress {
  interface Chainable {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    loginPage(pageFn: PageFunction<LoginPage>): Chainable<Element>;
    navbarPage(pageFn: PageFunction<NavbarPage>): Chainable<Element>;
    homePage(pageFn: PageFunction<HomePage>): Chainable<Element>;
    clientsPage(pageFn: PageFunction<ClientsPage>): Chainable<Element>;
    clientDetailsPage(
      pageFn: PageFunction<ClientDetailsPage>,
    ): Chainable<Element>;
    clientConfigPage(
      pageFn: PageFunction<ClientConfigPage>,
    ): Chainable<Element>;
    clientConfigDeleteDialog(
      pageFn: PageFunction<ClientConfigDeleteDialog>,
    ): Chainable<Element>;
    clientConfigRedirectUris(
      pageFn: PageFunction<ClientConfigRedirectUris>,
    ): Chainable<Element>;
    clientAuthsPage(pagFn: PageFunction<ClientAuthsPage>): Chainable<Element>;
    clientRolesPage(pageFn: PageFunction<ClientRolesPage>): Chainable<Element>;
    clientGrantsPage(
      pageFn: PageFunction<ClientGrantsPage>,
    ): Chainable<Element>;
    alertPage(pageFn: PageFunction<AlertPage>): Chainable<Element>;
    doLogin(): Chainable<Element>;
  }
}
