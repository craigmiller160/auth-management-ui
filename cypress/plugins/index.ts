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

import { CypressConfig } from '../types/cypress';
import { createPool } from './sql';

type OnFn = (name: string, value: object) => void;

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: OnFn, config: CypressConfig) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
    const pool = createPool(config.env);
}
