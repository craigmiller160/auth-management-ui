/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import cucumber from 'cypress-cucumber-preprocessor';
import { CypressConfig } from '../types/cypress';
import { createPool } from './sql/createPool';
import { deleteClient } from './sql/deleteClient';
import { insertClient } from './sql/insertClient';
import { insertUser } from './sql/insertUser';
import { deleteUser } from './sql/deleteUser';
import { insertRole } from './sql/insertRole';

type OnFn = (name: string, value: object) => void;

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: OnFn, config: CypressConfig) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config
	const pool = createPool(config.env);

	on(
		'file:preprocessor',
		cucumber({
			typescript: require.resolve('typescript')
		})
	);

	on('task', {
		deleteClient: deleteClient(pool),
		insertClient: insertClient(pool),
		insertUser: insertUser(pool),
		deleteUser: deleteUser(pool),
		insertRole: insertRole(pool)
	});
};
