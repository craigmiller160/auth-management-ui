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

export interface InsertUser {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	enabled: boolean;
}

interface UserIdRow {
	id: number;
}

interface RoleRow {
	id: number;
	name: string;
	client_id?: number; // eslint-disable-line camelcase
}

interface Arg {
	user: InsertUser;
	clientId: number;
}

/* eslint-disable max-len */
const INSERT_USER_SQL =
	'INSERT INTO dev.users (email, first_name, last_name, password, enabled) VALUES ($1,$2,$3,$4,$5)';
const SELECT_USER_ID = 'SELECT id FROM dev.users WHERE email = $1';
const INSERT_TOKEN_SQL =
	'INSERT INTO dev.refresh_tokens (id, refresh_token, client_id, user_id) VALUES ($1,$2,$3,$4)';
const INSERT_USER_CLIENT_SQL =
	'INSERT INTO dev.client_users (user_id, client_id) VALUES ($1,$2)';
const SELECT_ROLES_SQL = 'SELECT * FROM dev.roles WHERE client_id = $1';
const INSERT_CLIENT_USER_ROLES_SQL =
	'INSERT INTO dev.client_user_roles (user_id, client_id, role_id) VALUES ($1,$2,$3)';
/* eslint-enable max-len */

export const insertUser = (pool: Pool) => async (arg: Arg): Promise<number> => {
	const { user, clientId } = arg;
	const insertUserParams = [
		user.email,
		user.firstName,
		user.lastName,
		user.password,
		user.enabled
	];

	await safelyExecuteQuery<any>(pool, INSERT_USER_SQL, insertUserParams);

	const result: QueryResult<UserIdRow> = await safelyExecuteQuery<UserIdRow>(
		pool,
		SELECT_USER_ID,
		[user.email]
	);

	const userId = result.rows[0].id;

	if (userId && clientId) {
		await safelyExecuteQuery<any>(pool, INSERT_USER_CLIENT_SQL, [
			userId,
			clientId
		]);
		await safelyExecuteQuery<any>(pool, INSERT_TOKEN_SQL, [
			'1',
			'ABCDEFG',
			clientId,
			userId
		]);

		const roleResult: QueryResult<RoleRow> = await safelyExecuteQuery<RoleRow>(
			pool,
			SELECT_ROLES_SQL,
			[clientId]
		);
		const rolePromises = roleResult.rows.map((role) =>
			safelyExecuteQuery<any>(pool, INSERT_CLIENT_USER_ROLES_SQL, [
				userId,
				clientId,
				role.id
			])
		);
		await Promise.all(rolePromises);
	}

	return userId;
};
