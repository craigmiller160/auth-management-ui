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

const INSERT_TOKEN_SQL = 'INSERT INTO dev.refresh_tokens (refresh_token, client_id, user_id) VALUES ($1,$2,$3)';

export const insertRefreshToken = (pool: Pool) => async (userId: number, clientId: number) => {
    const params = [
        'ABCDEFGHIJKLMNOP',
        clientId,
        userId
    ];

    await safelyExecuteQuery<any>(pool, INSERT_TOKEN_SQL, params);
    return null;
};