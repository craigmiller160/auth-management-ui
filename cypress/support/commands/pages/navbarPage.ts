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

import createPage from './createPage'

const SELECT_NAVBAR_TITLE = '#navbar-title-btn'
const SELECT_AUTH_BTN = '#navbar-auth-btn'
const SELECT_USERS_BTN = '#navbar-item-users'
const SELECT_CLIENTS_BTN = '#navbar-item-clients'

const validateLoggedOut = () => {
  cy.get(SELECT_NAVBAR_TITLE).should('have.text', 'OAuth Management')

  cy.get(SELECT_USERS_BTN).should('not.be.visible')
  cy.get(SELECT_CLIENTS_BTN).should('not.be.visible')

  cy.get(SELECT_AUTH_BTN).should('have.text', 'Login')
}

const validateLoggedIn = () => {
  cy.get(SELECT_NAVBAR_TITLE).should('have.text', 'OAuth Management')

  cy.get(SELECT_USERS_BTN).should('be.visible')
  cy.get(SELECT_CLIENTS_BTN).should('be.visible')

  cy.get(SELECT_AUTH_BTN).should('have.text', 'Logout')
}

const clickAuthBtn = () => {
  cy.get(SELECT_AUTH_BTN).click()
}

const clickUsers = () => {
  cy.get(SELECT_USERS_BTN).click()
}

const clickClients = () => {
  cy.get(SELECT_CLIENTS_BTN).click()
}

const navbarPage = {
  validateLoggedOut,
  validateLoggedIn,
  clickAuthBtn,
  clickUsers,
  clickClients,
}

export type NavbarPage = typeof navbarPage
export default createPage(navbarPage)
