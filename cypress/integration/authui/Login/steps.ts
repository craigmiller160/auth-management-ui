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

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const onHomePageNotAuthenticated = () => {
	cy.navbarPage((navbarPage) => {
		navbarPage.validateLoggedOut();
	}).homePage((homePage) => {
		homePage.validatePage();
	});
};

Given(
	'I am on the home page, but not authenticated',
	onHomePageNotAuthenticated
);

When('I click the login button', () => {
	cy.navbarPage((navbarPage) => {
		navbarPage.clickAuthBtn();
	});
});

Then('I am redirected to the login page', () => {
	cy.loginPage((loginPage) => {
		loginPage.validatePage();
	});
});

When('I login', () => {
	cy.loginPage((loginPage) => {
		loginPage.login(Cypress.env('username'), Cypress.env('password'));
	});
});

Then('I am redirected to the home page, and fully authenticated', () => {
	cy.navbarPage((navbarPage) => {
		navbarPage.validateLoggedIn();
	}).homePage((homePage) => {
		homePage.validatePage();
	});
});

When('I click the logout button', () => {
	cy.navbarPage((navbarPage) => {
		navbarPage.clickAuthBtn();
	});
});

Then(
	'I am on the home page, but not authenticated',
	onHomePageNotAuthenticated
);
