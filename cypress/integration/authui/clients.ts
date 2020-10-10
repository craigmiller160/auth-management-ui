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

describe('Clients', () => {
    beforeEach(() => {
        // TODO execute setup sql

        cy.doLogin()
            .navbarPage((navbarPage) => {
                navbarPage.clickClients();
            });
    });

    it('New Client', () => {
        cy.clientsPage((clientsPage) => {
            clientsPage.validatePage();
            clientsPage.clickNewClientBtn();
        })
            .clientDetailsPage((clientDetailsPage) => {
                clientDetailsPage.validatePageCommon();
                clientDetailsPage.validateNewClientConfig();
            });

        // TODO execute SQL to clean up when done
    });

    it('Edit Client Config', () => {
        throw new Error();
    });

    it('Delete Client', () => {
        throw new Error();
    });

    it('Add/Edit/Delete client roles', () => {
        throw new Error();
    });

    it('Add/Remove user grants & roles', () => {
        throw new Error();
    });

    it('View/Remove user authentications', () => {
        throw new Error();
    });
});