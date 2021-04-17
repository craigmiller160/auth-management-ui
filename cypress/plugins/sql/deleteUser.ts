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

import { Pool, QueryResult } from 'pg';
import { safelyExecuteQuery } from './safelyExecuteQuery';

interface UserIdRow {
	id: number;
}

const SELECT_USER_ID_SQL = 'SELECT id FROM dev.users WHERE email = $1';
const DELETE_CLIENT_USER_ROLES_SQL =
	'DELETE FROM dev.client_user_roles WHERE user_id = $1';
const DELETE_CLIENT_USERS_SQL =
	'DELETE FROM dev.client_users WHERE user_id = $1';
const DELETE_REFRESH_TOKENS_SQL =
	'DELETE FROM dev.refresh_tokens WHERE user_id = $1';
const DELETE_USER_SQL = 'DELETE FROM dev.users WHERE id = $1';

export const deleteUser = (pool: Pool) => async (email: string) => {
	const result: QueryResult<UserIdRow> = await safelyExecuteQuery<UserIdRow>(
		pool,
		SELECT_USER_ID_SQL,
		[ email ]
	);

	if (result.rows?.[0]?.id) {
		const userId = result.rows[0].id;

		await safelyExecuteQuery<any>(pool, DELETE_REFRESH_TOKENS_SQL, [
			userId
		]);
		await safelyExecuteQuery<any>(pool, DELETE_CLIENT_USER_ROLES_SQL, [
			userId
		]);
		await safelyExecuteQuery<any>(pool, DELETE_CLIENT_USERS_SQL, [ userId ]);
		await safelyExecuteQuery<any>(pool, DELETE_USER_SQL, [ userId ]);
	}
	return null;
};
