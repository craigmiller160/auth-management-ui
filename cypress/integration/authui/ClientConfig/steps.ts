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

/// <reference path="../../../support/index.d.ts" />

import {
	And,
	Then,
	When,
	After,
	Before
} from 'cypress-cucumber-preprocessor/steps';
import { TableDefinition } from 'cucumber';
import { TAB_INDEX_CONFIG } from '../../../support/commands/pages/client/clientDetailsPage';
import { ClientConfigValues } from '../../../support/commands/pages/client/clientConfigPage';
import { testClient } from '../../../data/client';

const CLIENT_KEY = 'clientKey';
const isNewClient = (clientType: string) => clientType === 'new';

const cleanup = () => {
	cy.task('deleteClient', 'New Client');
	cy.task('deleteClient', 'Test Client');
	cy.task('deleteClient', 'Test Client 2');
};

Before(() => {
	cleanup();
	cy.task('insertClient', testClient);
});

After(() => {
	cleanup();
});

When('I click the new client button', () => {
	cy.clientsPage((clientsPage) => {
		clientsPage.clickNewClientBtn();
	});
});

Then(
	'I am on the client details page for a {string} client',
	(clientType: string) => {
		cy.clientDetailsPage((clientDetailsPage) => {
			clientDetailsPage.validatePageCommon(isNewClient(clientType));
		});
	}
);

const createClientKeyValidator = (row: Array<string>): ClientConfigValues => ({
	clientName: row[0],
	accessTokenTimeout: parseInt(row[1], 10),
	refreshTokenTimeout: parseInt(row[2], 10),
	authCodeTimeout: parseInt(row[3], 10),
	enabled: row[4] === 'true',
	clientSecretHasPlaceholder: row[5] === 'true',
	clientKeyValidator: (value: string) => {
		if (row[6] === 'true') {
			cy.get(`@${CLIENT_KEY}`).then(($key) =>
				expect($key).to.equal(value)
			);
		} else if (row[7]) {
			expect(row[7]).to.equal(value);
		} else {
			expect('').not.to.equal(value);
		}
	}
});

And(
	'the client config tab is selected with these values for {string} client',
	(clientType: string, data: TableDefinition) => {
		const values: ClientConfigValues = data
			.rows()
			.map(createClientKeyValidator)[0];

		cy.clientDetailsPage((clientDetailsPage) => {
			clientDetailsPage.isTabSelected(TAB_INDEX_CONFIG);
		}).clientConfigPage((clientConfigPage) => {
			clientConfigPage.validateClientConfigCommon(
				isNewClient(clientType)
			);
			clientConfigPage.validateClientConfigValues(values);
			clientConfigPage
				.getClientKeyField()
				.then(($key) => cy.wrap($key.val()).as(CLIENT_KEY));
		});
	}
);

When('I click the save button', () => {
	cy.clientConfigPage((clientConfigPage) => {
		clientConfigPage.clickSaveBtn();
	});
});

And(
	'the list {string} contain a client with the name {string}',
	(action: string, clientName: string) => {
		cy.clientsPage((clientsPage) => {
			if (action === 'does') {
				clientsPage.clientRecordExists(clientName, true);
			} else if (action === 'does not') {
				clientsPage.clientRecordExists(clientName, false);
			} else {
				throw new Error(`Invalid action: ${action}`);
			}
		});
	}
);

And(
	'the client config page contains these redirect uris',
	(data: TableDefinition) => {
		const uris: Array<string> = data.rows().map((row) => row[0]);
		cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
			clientConfigRedirectUris.validateRedirectList(uris);
		});
	}
);

Then('I generate a new client {string}', (genFieldName: string) => {
	cy.clientConfigPage((clientConfigPage) => {
		clientConfigPage.generateFieldValue(genFieldName);
		if (CLIENT_KEY === genFieldName) {
			clientConfigPage.getClientKeyField().then(($key) => {
				cy.wrap($key.val()).as(CLIENT_KEY);
			});
		}
	});
});

Then('I set the following client config values', (data: TableDefinition) => {
	const values: ClientConfigValues = data
		.rows()
		.map(createClientKeyValidator)[0];
	cy.clientConfigPage((clientConfigPage) => {
		clientConfigPage.setConfigValues(values);
	});
});

When('I click the delete button, and confirm the prompt', () => {
	cy.clientConfigPage((clientConfigPage) => {
		clientConfigPage.clickDeleteBtn();
	})
		.clientConfigDeleteDialog((clientConfigDeleteDialog) => {
			clientConfigDeleteDialog.validateDeleteDialog(true);
			clientConfigDeleteDialog.clickDeleteCancel();
			clientConfigDeleteDialog.validateDeleteDialog(false);
		})
		.clientConfigPage((clientConfigPage) => {
			clientConfigPage.clickDeleteBtn();
		})
		.clientConfigDeleteDialog((clientConfigDeleteDialog) => {
			clientConfigDeleteDialog.clickDeleteConfirm();
		});
});

When('I click on the Add Redirect URI button', () => {
	cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
		clientConfigRedirectUris.clickAddRedirectUri();
	});
});

Then(
	'the redirect uri dialog appears with {string} in its text field',
	(uriText) => {
		cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
			clientConfigRedirectUris.validateRedirectDialog(true, uriText);
		});
	}
);

When(
	'I type the uri {string} into the redirect uri dialog',
	(uriText: string) => {
		cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
			clientConfigRedirectUris.typeUriInDialog(uriText);
		});
	}
);

And(
	'I click the {string} button for the redirect uri dialog',
	(buttonType: string) => {
		cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
			if (buttonType === 'save') {
				clientConfigRedirectUris.clickDialogSave();
			} else if (buttonType === 'cancel') {
				clientConfigRedirectUris.clickDialogCancel();
			} else {
				throw new Error(`Invalid button type: ${buttonType}`);
			}
		});
	}
);

When(
	'I click on the {string} button for URI {int}',
	(buttonType: string, index: number) => {
		cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
			if (buttonType === 'edit') {
				clientConfigRedirectUris.clickEditUriBtn(index);
			} else if (buttonType === 'remove') {
				clientConfigRedirectUris.clickRemoveUriBtn(index);
			} else {
				throw new Error(`Invalid button type: ${buttonType}`);
			}
		});
	}
);

Then('the redirect uri dialog disappears', () => {
	cy.clientConfigRedirectUris((clientConfigRedirectUris) => {
		clientConfigRedirectUris.validateRedirectDialog(false);
	});
});
