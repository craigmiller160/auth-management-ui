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

interface BaseUser {
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserClient {
  id: number;
  name: string;
  clientKey: string;
  allRoles: Array<UserRole>;
  userRoles: Array<UserRole>;
}

export interface UserInput extends BaseUser {
  password: string;
}

export interface UserDetails extends BaseUser {
  id: number;
}

export interface UserClients {
  id: number;
  email: string;
  clients: Array<UserClient>;
}

export interface UserList {
  users: Array<UserDetails>;
}

export interface UserAuthDetails {
  clientId: number;
  clientName: string;
  userId: number;
  userEmail: string;
  lastAuthenticated: string | null;
}

export interface UserAuthDetailsList {
  email: string;
  authDetails: Array<UserAuthDetails>;
}
