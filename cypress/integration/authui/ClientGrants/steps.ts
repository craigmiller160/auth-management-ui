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

/* eslint-disable */
import {
	After,
	And,
	Before,
	Then,
	When
} from 'cypress-cucumber-preprocessor/steps';
import { TableDefinition } from 'cucumber';
import { testUser, testUser2 } from '../../../data/user';
import { testClient } from '../../../data/client';
import { GrantData } from '../../../support/commands/pages/client/clientGrantsPage';

const cleanup = () => {
	cy.task('deleteUser', 'test@gmail.com');
	cy.task('deleteClient', 'Test Client');
	cy.task('deleteUser', 'test2@gmail.com');
};

Before(() => {
	cleanup();
	cy.task('insertClient', testClient).then((clientId) => {
		cy.task('insertUser', { user: testUser, clientId }).then(() =>
			cy.task('insertRole', { name: 'ROLE_WRITE', clientId })
		);
	});
	cy.task('insertUser', testUser2);
});

After(() => {
	cleanup();
});

Then('the client grants page is displayed', (data: TableDefinition) => {
	const grantData: GrantData = data.rows().reduce(
		(acc: GrantData, row: Array<string>, index: number) => {
			const users = [...acc.users];
			const roles = [...acc.roles];

			const selectedUser = index === 0 ? row[2] : acc.selectedUser;

			if (row[0]) {
				users.push(row[0]);
			}

			if (row[1]) {
				roles.push(row[1]);
			}

			return {
				users,
				roles,
				selectedUser
			};
		},
		{ users: [], roles: [] }
	);

	cy.clientGrantsPage((clientGrantsPage) => {
		clientGrantsPage.validatePage(grantData);
	});
});

When('I select user {int}', (userIndex: number) => {
	cy.clientGrantsPage((clientGrantsPage) => {
		clientGrantsPage.selectUser(userIndex);
	});
});

When('I click the Add User button', () => {
	cy.clientGrantsPage((clientGrantsPage) => {
		clientGrantsPage.clickAddUserBtn();
	});
});

Then('the user dialog is visible', () => {
	cy.clientGrantsPage((clientGrantsPage) => {
		clientGrantsPage.validateUserDialog();
	});
});

And('I select {string} in the user dialog', (userEmail: string) => {
	// TODO finish this
});

When(
	'I click on the {string} button in the user dialog',
	(buttonType: string) => {
		cy.clientGrantsPage((clientGrantsPage) => {
			switch (buttonType) {
				case 'select':
					clientGrantsPage.clickUserDialogSelectBtn();
					break;
				case 'cancel':
					clientGrantsPage.clickUserDialogCancelBtn();
					break;
				default:
					throw new Error(`Invalid button type: ${buttonType}`);
			}
		});
	}
);

When(
	'I click on the {string} button of user {int}',
	(buttonType: string, userIndex: number) => {
		cy.clientGrantsPage((clientGrantsPage) => {
			switch (buttonType) {
				case 'go':
					clientGrantsPage.clickUserGoBtn(userIndex);
					break;
				case 'remove':
					clientGrantsPage.clickUserRemoveBtn(userIndex);
					break;
				default:
					throw new Error(`Invalid button type: ${buttonType}`);
			}
		});
	}
);

Then('the remove user dialog is visible', () => {
	// TODO finish this
});

When(
	'I click on the {string} button of the remove user dialog',
	(buttonType: string) => {
		// TODO finish this
	}
);

Then('the role dialog is visible', () => {
	// TODO finish this
});

And('I select {string} in the role dialog', (roleName: string) => {
	// TODO finish this
});

When(
	'I click on the {string} button in the role dialog',
	(buttonType: string) => {
		// TODO finish this
	}
);

Then('the remove role dialog is visible', () => {
	// TODO finish this
});

When(
	'I click on the {string} button of the remove role dialog',
	(buttonType: string) => {
		// TODO finish this
	}
);

Then('I am on the user config page for {string}', (userEmail: string) => {
	// TODO finish this
});

When('I click on the Add Role button', () => {
	cy.clientGrantsPage((clientGrantsPage) => {
		clientGrantsPage.clickAddRoleBtn();
	});
});

When(
	'I click on the {string} button for role {int}',
	(buttonType: string, roleIndex: number) => {
		cy.clientGrantsPage((clientGrantsPage) => {
			switch (buttonType) {
				case 'remove':
					clientGrantsPage.clickRoleRemoveBtn(roleIndex);
					break;
				default:
					throw new Error(`Invalid button type: ${buttonType}`);
			}
		});
	}
);
