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

const SELECT_CLIENT_GRANTS = '#client-grants-page';
const SELECT_CLIENT_GRANTS_TITLE = '#client-grants-page #client-grants-title';
const SELECT_CLIENT_USERS_TITLE = '#client-grants-page #client-grant-users-title';
const SELECT_CLIENT_USERS_LIST = '#client-grants-page #client-grant-users-list';
const SELECT_NO_CLIENT_USERS_MSG = '#client-grants-page #no-client-grant-users-msg';
const SELECT_ADD_CLIENT_USER_BTN = '#client-grants-page #add-client-user-btn';
const SELECT_ADD_USER_DIALOG = '#add-client-user-dialog';
const SELECT_REMOVE_USER_DIALOG = '#remove-client-user-dialog';
const SELECT_CLIENT_GRANT_ROLES_TITLE = '#client-grants-page #client-grant-roles-title';
const SELECT_CLIENT_GRANT_ROLES_LIST = '#client-grants-page #client-grant-roles-list';
const SELECT_NO_CLIENT_ROLES_MSG = '#client-grants-page #no-client-roles-msg';
const SELECT_ADD_CLIENT_ROLE_BTN = '#client-grants-page #add-client-role-btn';
const SELECT_CLIENT_ROLE_DIALOG = '#client-role-dialog';
const SELECT_REMOVE_CLIENT_ROLE_DIALOG = '#remove-client-role-dialog';

const validatePage = () => {

};

const clientGrantsPage = {
    validatePage
};

export type ClientGrantsPage = typeof clientGrantsPage;
export default createPage(clientGrantsPage);