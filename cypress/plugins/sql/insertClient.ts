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

import { Pool, QueryResult } from 'pg'
import { safelyExecuteQuery } from './safelyExecuteQuery'

export interface InsertClient {
  name: string
  clientKey: string
  clientSecret: string
  enabled: boolean
  accessTokenTimeout: number
  refreshTokenTimeout: number
  authCodeTimeout: number
  redirectUris: Array<string>
  roles: Array<string>
}

interface ClientIdRow {
  id: number
}

/* eslint-disable max-len */
const SELECT_CLIENT_ID = 'SELECT id FROM dev.clients WHERE name = $1'
const INSERT_URI_SQL =
  'INSERT INTO dev.client_redirect_uris (client_id, redirect_uri) VALUES ($1, $2)'
const INSERT_CLIENT_SQL =
  'INSERT INTO dev.clients (name, client_key, client_secret, enabled, access_token_timeout_secs, refresh_token_timeout_secs, auth_code_timeout_secs) VALUES ($1, $2, $3, $4, $5, $6, $7)'
const INSERT_ROLE_SQL = 'INSERT INTO dev.roles (name, client_id) VALUES ($1,$2)'
/* eslint-enable max-len */

export const insertClient = (pool: Pool) => async (
  client: InsertClient,
): Promise<number> => {
  const insertClientParams = [
    client.name,
    client.clientKey,
    client.clientSecret,
    client.enabled,
    client.accessTokenTimeout,
    client.refreshTokenTimeout,
    client.authCodeTimeout,
  ]
  await safelyExecuteQuery<any>(pool, INSERT_CLIENT_SQL, insertClientParams)

  const result: QueryResult<ClientIdRow> = await safelyExecuteQuery<ClientIdRow>(
    pool,
    SELECT_CLIENT_ID,
    [ client.name ],
  )
  const clientId = result.rows[0].id

  const uriPromises = client.redirectUris.map((uri) =>
    safelyExecuteQuery<any>(pool, INSERT_URI_SQL, [ clientId, uri ]),
  )
  await Promise.all(uriPromises)

  const rolePromises = client.roles.map((role) =>
    safelyExecuteQuery<any>(pool, INSERT_ROLE_SQL, [ role, clientId ]),
  )
  await Promise.all(rolePromises)

  return clientId
}
