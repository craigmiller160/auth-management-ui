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

import createPage from '../createPage';

/* eslint-disable @typescript-eslint/no-unused-vars */
const SELECT_CLIENT_GRANTS = '#client-grants-page';
const SELECT_CLIENT_GRANTS_TITLE = '#client-grants-page #client-grants-title';
const SELECT_CLIENT_USERS_TITLE =
  '#client-grants-page #client-grant-users-title';
const SELECT_CLIENT_USERS_LIST = '#client-grants-page #client-grant-users-list';
const SELECT_NO_CLIENT_USERS_MSG =
  '#client-grants-page #no-client-grant-users-msg';
const SELECT_ADD_CLIENT_USER_BTN = '#client-grants-page #add-client-user-btn';
const SELECT_ADD_USER_DIALOG = '#add-client-user-dialog';
const SELECT_REMOVE_USER_DIALOG = '#remove-client-user-dialog';
const SELECT_CLIENT_GRANT_ROLES_TITLE =
  '#client-grants-page #client-grant-roles-title';
const SELECT_CLIENT_GRANT_ROLES_LIST =
  '#client-grants-page #client-grant-roles-list';
const SELECT_NO_CLIENT_ROLES_MSG = '#client-grants-page #no-client-roles-msg';
const SELECT_ADD_CLIENT_ROLE_BTN = '#client-grants-page #add-client-role-btn';
const SELECT_CLIENT_ROLE_DIALOG = '#client-role-dialog';
const SELECT_REMOVE_CLIENT_ROLE_DIALOG = '#remove-client-role-dialog';
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface GrantData {
  users: Array<string>;
  roles: Array<string>;
  selectedUser?: string;
}

const validatePage = (grantData: GrantData) => {
  cy.get(SELECT_CLIENT_GRANTS).should('exist');
  cy.get(SELECT_CLIENT_GRANTS_TITLE).should('have.text', 'Test Client');

  cy.get(SELECT_CLIENT_USERS_TITLE).should('have.text', 'Users');
  cy.get(SELECT_CLIENT_USERS_LIST)
    .should('exist')
    .find('li')
    .should('have.length', grantData.users.length)
    .each(($li, index) => {
      // TODO need a way to validate what roles a user has assigned

      const isSelected = grantData.users[index] === grantData.selectedUser;
      cy.wrap($li).should(`${isSelected ? '' : 'not.'}have.class`, 'active');

      cy.wrap($li)
        .find('.MuiListItemText-primary')
        .should('have.text', grantData.users[index]);

      cy.wrap($li).find('button').eq(0).should('have.text', 'Go');
      cy.wrap($li).find('button').eq(1).should('have.text', 'Remove');
    });

  cy.get(SELECT_CLIENT_GRANT_ROLES_TITLE).should('have.text', 'Roles');
  if (grantData.selectedUser && grantData.roles.length > 0) {
    cy.get(SELECT_NO_CLIENT_ROLES_MSG).should('not.exist', 'No Roles');
    cy.get(SELECT_CLIENT_GRANT_ROLES_LIST)
      .should('exist')
      .find('li')
      .should('have.length', grantData.roles.length)
      .each(($li, index) => {
        cy.wrap($li)
          .find('.MuiListItemText-primary')
          .should('have.text', grantData.roles[index]);
        cy.wrap($li).find('button').should('have.text', 'Remove');
      });
    cy.get(SELECT_ADD_CLIENT_ROLE_BTN).should('have.text', 'Add Role');
  } else if (grantData.selectedUser && grantData.roles.length === 0) {
    cy.get(SELECT_NO_CLIENT_ROLES_MSG).should('have.text', 'No Roles');
    cy.get(SELECT_CLIENT_GRANT_ROLES_LIST).should('not.exist');
    cy.get(SELECT_ADD_CLIENT_ROLE_BTN).should('have.text', 'Add Role');
  } else {
    cy.get(SELECT_NO_CLIENT_ROLES_MSG).should('not.exist');
    cy.get(SELECT_CLIENT_GRANT_ROLES_LIST).should('not.exist');
    cy.get(SELECT_ADD_CLIENT_ROLE_BTN).should('not.exist');
  }
};

const selectUser = (userIndex: number) => {
  cy.get(SELECT_CLIENT_USERS_LIST)
    .find('li')
    .eq(userIndex)
    .click()
    .should('have.class', 'active');
};

const clickAddUserBtn = () => {
  cy.get(SELECT_ADD_CLIENT_USER_BTN).click();
};

const clickAddRoleBtn = () => {
  cy.get(SELECT_ADD_CLIENT_ROLE_BTN).click();
};

const validateUserDialog = () => {
  // TODO how to validate the list of users here
  cy.get(SELECT_ADD_USER_DIALOG).should('exist');

  cy.get(SELECT_ADD_USER_DIALOG)
    .find('.MuiDialogTitle-root h2')
    .should('have.text', 'Add User');

  cy.get(SELECT_ADD_USER_DIALOG)
    .find('.MuiAutocomplete-root')
    .should('exist')
    .find('label')
    .should('have.text', 'User');

  cy.get(SELECT_ADD_USER_DIALOG)
    .find('button')
    .eq(0)
    .should('have.text', 'Select');

  cy.get(SELECT_ADD_USER_DIALOG)
    .find('button')
    .eq(1)
    .should('have.text', 'Cancel');
};

const clickUserDialogSelectBtn = () => {
  cy.get(SELECT_ADD_USER_DIALOG).find('button').eq(0).click();
};

const clickUserDialogCancelBtn = () => {
  cy.get(SELECT_ADD_USER_DIALOG).find('button').eq(1).click();
};

const clickUserGoBtn = (userIndex: number) => {
  cy.get(SELECT_CLIENT_USERS_LIST)
    .find('li')
    .eq(userIndex)
    .find('button')
    .eq(0)
    .click();
};

const clickUserRemoveBtn = (userIndex: number) => {
  cy.get(SELECT_CLIENT_USERS_LIST)
    .find('li')
    .eq(userIndex)
    .find('button')
    .eq(1)
    .click();
};

const clickRoleRemoveBtn = (roleIndex: number) => {
  cy.get(SELECT_CLIENT_GRANT_ROLES_LIST)
    .find('li')
    .eq(roleIndex)
    .find('button')
    .eq(0)
    .click();
};

const clientGrantsPage = {
  validatePage,
  selectUser,
  clickAddUserBtn,
  clickAddRoleBtn,
  validateUserDialog,
  clickUserDialogSelectBtn,
  clickUserDialogCancelBtn,
  clickUserGoBtn,
  clickUserRemoveBtn,
  clickRoleRemoveBtn
};

export type ClientGrantsPage = typeof clientGrantsPage;
export default createPage(clientGrantsPage);
