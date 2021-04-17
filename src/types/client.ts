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

import { UserAuthDetails } from './user';

export interface ClientListItem {
  id: number;
  name: string;
  clientKey: string;
}

export interface ClientListResponse {
  clients: Array<ClientListItem>;
}

export interface ClientRole {
  id: number;
  name: string;
}

export interface ClientUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: Array<ClientRole>;
}

interface BaseClient {
  name: string;
  clientKey: string;
  enabled: boolean;
  accessTokenTimeoutSecs: number;
  refreshTokenTimeoutSecs: number;
  authCodeTimeoutSecs: number;
  redirectUris: Array<string>;
}

export interface ClientDetails extends BaseClient {
  id: number;
}

export interface FullClientDetails extends ClientDetails {
  id: number;
  roles: Array<ClientRole>;
  users: Array<ClientUser>;
}

export interface ClientInput extends BaseClient {
  clientSecret: string;
}

export interface ClientWithRoles {
  id: number;
  name: string;
  roles: Array<ClientRole>;
}

export interface ClientAuthDetails {
  clientName: string;
  userAuthDetails: Array<UserAuthDetails>;
}
