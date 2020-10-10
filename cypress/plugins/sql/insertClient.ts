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

import { Pool } from 'pg';
import { safelyExecuteQuery } from './safelyExecuteQuery';

export interface InsertClient {
    name: string;
    clientKey: string;
    clientSecret: string;
    enabled: boolean;
    accessTokenTimeout: number;
    refreshTokenTimeout: number;
    authCodeTimeout: number;
}

const INSERT_CLIENT_SQL = 'INSERT INTO dev.clients (name, client_key, client_secret, enabled, access_token_timeout_secs, refresh_token_timeout_secs, auth_code_timeout_secs) VALUES ($1, $2, $3, $4, $5, $6, $7)';

export const insertClient = (pool: Pool) => async (client: InsertClient) => {
    const params = [
        client.name,
        client.clientKey,
        client.clientSecret,
        client.enabled,
        client.accessTokenTimeout,
        client.refreshTokenTimeout,
        client.authCodeTimeout
    ];
    await safelyExecuteQuery<any>(pool, INSERT_CLIENT_SQL, params);
    return null;
};