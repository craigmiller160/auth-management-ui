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

import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I login to the application', () => {
  cy.doLogin();
});

Then(
  'a {string} alert appears with a message containing {string}',
  (alertType: string, message: string) => {
    cy.alertPage((alertPage) => {
      alertPage.isVisible(true);
      switch (alertType) {
        case 'success':
          alertPage.isSuccess();
          break;
        case 'error':
          alertPage.isError();
          break;
        default:
          throw new Error(`Invalid alert type: ${alertType}`);
      }

      alertPage.messageContains(message);
      alertPage.closeAlert();
      alertPage.isVisible(false);
    });
  }
);
