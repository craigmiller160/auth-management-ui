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

import { TAB_INDEX_CONFIG } from '../../support/commands/pages/clientDetailsPage';
import { ClientConfigValues } from '../../support/commands/pages/clientConfigPage';

type CleanupFn = () => void;

const postSaveNewClientValues: ClientConfigValues = {
    clientName: 'New Client',
    clientKey: '',
    enabled: true,
    accessTokenTimeout: 300,
    refreshTokenTimeout: 3600,
    authCodeTimeout: 60,
    redirectUris: []
};

describe('Clients', () => {
    let cleanupTasks: Array<CleanupFn>;

    beforeEach(() => {
        // TODO execute setup sql
        cleanupTasks = [];
        cy.doLogin()
            .navbarPage((navbarPage) => {
                navbarPage.clickClients();
            });
    });

    afterEach(() => {
        cleanupTasks.forEach((task) => task());
    });

    it('New Client', () => {
        cy.clientsPage((clientsPage) => {
            clientsPage.validatePage();
            clientsPage.clickNewClientBtn();
        })
            .clientDetailsPage((clientDetailsPage) => {
                clientDetailsPage.validatePageCommon(true);
                clientDetailsPage.isTabSelected(TAB_INDEX_CONFIG);
            })
            .clientConfigPage((clientConfigPage) => {
                clientConfigPage.validateClientConfigCommon(true);
                clientConfigPage.validateNewClientConfigValues();
                clientConfigPage.clickSaveBtn();

                cleanupTasks.push(() => cy.task('deleteClient', 'New Client'));

                clientConfigPage.validateClientConfigCommon(false);
                clientConfigPage.validateExistingClientConfigValues(postSaveNewClientValues);
            })
            .clientDetailsPage((clientDetailsPage) => {
                clientDetailsPage.validatePageCommon(false);
                clientDetailsPage.isTabSelected(TAB_INDEX_CONFIG);
            })
            .alertPage((alertPage) => {
                alertPage.isVisible();
                alertPage.isSuccess();
                alertPage.messageEquals('Successfully saved client new');
                alertPage.closeAlert();
            })
            .navbarPage((navbarPage) => {
                navbarPage.clickClients();
            })
            .clientsPage((clientsPage) => {
                clientsPage.clientRecordExists('New Client');
            });
    });

    it('Edit Client Config', () => {
        // TODO don't forget about generating new key/secret
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