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

const SELECT_CLIENT_ID_SQL = 'SELECT id FROM dev.clients WHERE name = $1'
const DELETE_CLIENT_SQL = 'DELETE FROM dev.clients WHERE id = $1'
const DELETE_ROLES_SQL = 'DELETE FROM dev.roles WHERE client_id = $1'
const DELETE_CLIENT_USERS_SQL =
  'DELETE FROM dev.client_users WHERE client_id = $1'
const DELETE_CLIENT_USER_ROLES_SQL =
  'DELETE FROM dev.client_user_roles WHERE client_id = $1'
const DELETE_CLIENT_REDIRECT_URIS_SQL =
  'DELETE FROM dev.client_redirect_uris WHERE client_id = $1'
const DELETE_REFRESH_TOKENS_SQL =
  'DELETE FROM dev.refresh_tokens WHERE client_id = $1'

interface ClientIdRow {
  id: number
}

export const deleteClient = (pool: Pool) => async (clientName: string) => {
  const result: QueryResult<ClientIdRow> = await safelyExecuteQuery<ClientIdRow>(
    pool,
    SELECT_CLIENT_ID_SQL,
    [ clientName ],
  )
  if (result.rows?.[0]?.id) {
    const clientId = result.rows[0].id

    await safelyExecuteQuery<any>(pool, DELETE_REFRESH_TOKENS_SQL, [ clientId ])
    await safelyExecuteQuery<any>(pool, DELETE_CLIENT_REDIRECT_URIS_SQL, [
      clientId,
    ])
    await safelyExecuteQuery<any>(pool, DELETE_CLIENT_USER_ROLES_SQL, [
      clientId,
    ])
    await safelyExecuteQuery<any>(pool, DELETE_CLIENT_USERS_SQL, [ clientId ])
    await safelyExecuteQuery<any>(pool, DELETE_ROLES_SQL, [ clientId ])
    await safelyExecuteQuery<any>(pool, DELETE_CLIENT_SQL, [ clientId ])
  }
  return null
}
