// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import loginPage from './commands/loginPage';
import navbarPage from './commands/navbarPage';
import doLogin from './commands/doLogin';
import homePage from './commands/homePage';
import clientsPage from './commands/clientsPage';

Cypress.Commands.add('loginPage', loginPage);
Cypress.Commands.add('navbarPage', navbarPage);
Cypress.Commands.add('doLogin', doLogin);
Cypress.Commands.add('homePage', homePage);
Cypress.Commands.add('clientsPage', clientsPage);