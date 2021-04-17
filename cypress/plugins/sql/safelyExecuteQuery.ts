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

export const safelyExecuteQuery = <R>(
  pool: Pool,
  sql: string,
  params: Array<any> = [],
): Promise<QueryResult<R>> =>
  pool
    .connect()
    .then((client) =>
      client
        .query<R>(sql, params)
        .then((result) => {
          client.release();
          return result;
        })
        .catch((ex) => {
          client.release();
          console.log(`Error executing query: ${sql}`); // eslint-disable-line no-console
          console.log(ex); // eslint-disable-line no-console
          return null;
        }),
    )
    .catch((ex) => {
      console.log('Error connecting to Postgres'); // eslint-disable-line no-console
      console.log(ex); // eslint-disable-line no-console
      return null;
    });
