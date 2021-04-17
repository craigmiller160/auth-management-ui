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

const SELECT_DELETE_DIALOG = '#delete-client-dialog';
const SELECT_DELETE_DIALOG_TITLE = '#delete-client-dialog h2';
const SELECT_DELETE_DIALOG_BODY = '#delete-client-dialog p';
const SELECT_DELETE_DIALOG_CONFIRM =
  '#delete-client-dialog #delete-client-dialog-btn-0';
const SELECT_DELETE_DIALOG_CANCEL =
  '#delete-client-dialog #delete-client-dialog-btn-1';

const validateDeleteDialog = (showDialog: boolean) => {
  if (showDialog) {
    cy.get(SELECT_DELETE_DIALOG_TITLE).should('have.text', 'Delete Client');
    cy.get(SELECT_DELETE_DIALOG_BODY).should(
      'have.text',
      'Are you sure you want to delete this client?',
    );

    cy.get(SELECT_DELETE_DIALOG_CONFIRM).should('have.text', 'Confirm');
    cy.get(SELECT_DELETE_DIALOG_CANCEL).should('have.text', 'Cancel');
  } else {
    cy.get(SELECT_DELETE_DIALOG).should('not.exist');
  }
};

const clickDeleteConfirm = () => {
  cy.get(SELECT_DELETE_DIALOG_CONFIRM).click();
};

const clickDeleteCancel = () => {
  cy.get(SELECT_DELETE_DIALOG_CANCEL).click();
};

const clientConfigDeleteDialog = {
  validateDeleteDialog,
  clickDeleteConfirm,
  clickDeleteCancel,
};

export type ClientConfigDeleteDialog = typeof clientConfigDeleteDialog;
export default createPage(clientConfigDeleteDialog);
