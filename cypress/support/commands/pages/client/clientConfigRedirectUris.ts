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

const SELECT_REDIRECT_URIS_LIST = '#client-config-page #redirect-uris-list';
const SELECT_ADD_REDIRECT_BTN = '#client-config-page #add-redirect-uri-btn';

const SELECT_REDIRECT_DIALOG = '#redirect-uri-dialog';
const SELECT_REDIRECT_DIALOG_TITLE =
	'#redirect-uri-dialog div.MuiDialogTitle-root h2';
const SELECT_REDIRECT_DIALOG_INPUT = '#redirect-uri-dialog input';
const SELECT_REDIRECT_DIALOG_SAVE_BTN = '#redirect-uri-dialog-btn-0';
const SELECT_REDIRECT_DIALOG_CANCEL_BTN = '#redirect-uri-dialog-btn-1';

const validateRedirectDialog = (showDialog: boolean, uriText: string = '') => {
	if (showDialog) {
		cy.get(SELECT_REDIRECT_DIALOG).should('exist');
		cy.get(SELECT_REDIRECT_DIALOG_TITLE).should(
			'have.text',
			'Redirect URI'
		);
		cy.get(SELECT_REDIRECT_DIALOG_INPUT).should('have.value', uriText);
		cy.get(SELECT_REDIRECT_DIALOG_SAVE_BTN).should('have.text', 'Save');
		cy.get(SELECT_REDIRECT_DIALOG_CANCEL_BTN).should('have.text', 'Cancel');
	} else {
		cy.get(SELECT_REDIRECT_DIALOG).should('not.exist');
	}
};

const validateRedirectList = (uris: Array<String>) => {
	cy.get(SELECT_REDIRECT_URIS_LIST).should('exist');

	cy.get(SELECT_ADD_REDIRECT_BTN).should('have.text', 'Add Redirect URI');

	cy.get(SELECT_REDIRECT_URIS_LIST)
		.find('li')
		.should('have.length', uris.length)
		.each(($li, index) => {
			cy.wrap($li)
				.find('.MuiListItemText-primary')
				.should('have.text', uris[index]);
			cy.wrap($li)
				.find('button')
				.should('have.length', 2)
				.each(($btn, index2) => {
					if (index2 === 0) {
						cy.wrap($btn).should('have.text', 'Edit');
					} else {
						cy.wrap($btn).should('have.text', 'Remove');
					}
				});
		});
};

const clickDialogSave = () => {
	cy.get(SELECT_REDIRECT_DIALOG_SAVE_BTN).click();
};

const clickDialogCancel = () => {
	cy.get(SELECT_REDIRECT_DIALOG_CANCEL_BTN).click();
};

const typeUriInDialog = (uri: string) => {
	cy.get(SELECT_REDIRECT_DIALOG_INPUT).clear().type(uri);
};

const clickAddRedirectUri = () => {
	cy.get(SELECT_ADD_REDIRECT_BTN).click();
};

const clickEditUriBtn = (index: number) => {
	cy.get(SELECT_REDIRECT_URIS_LIST)
		.find('li')
		.eq(index)
		.find('button')
		.eq(0)
		.click();
};

const clickRemoveUriBtn = (index: number) => {
	cy.get(SELECT_REDIRECT_URIS_LIST)
		.find('li')
		.eq(index)
		.find('button')
		.eq(1)
		.click();
};

const clientConfigRedirectUris = {
	validateRedirectDialog,
	typeUriInDialog,
	validateRedirectList,
	clickAddRedirectUri,
	clickDialogSave,
	clickDialogCancel,
	clickEditUriBtn,
	clickRemoveUriBtn
};

export type ClientConfigRedirectUris = typeof clientConfigRedirectUris;
export default createPage(clientConfigRedirectUris);
