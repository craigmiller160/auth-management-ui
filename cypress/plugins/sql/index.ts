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

import { Pool, PoolClient, QueryResult } from 'pg';
import * as TE from 'fp-ts/es6/TaskEither';
import { TaskEither } from 'fp-ts/es6/TaskEither';
import { pipe } from 'fp-ts/es6/function';

const safelyExecuteQuery = <R>(pool: Pool, sql: string, params: Array<any> = []): TaskEither<Error,QueryResult<R>> => {
    return pipe(
        TE.tryCatch(
            () => pool.connect(),
            (ex) => {
                console.log('Error connecting to Postgres');
                return ex as Error;
            }
        ),
        TE.map((client: PoolClient) => {
            return TE.tryCatch(
                async () => {
                    const result: QueryResult<R> = await client.query<R>(sql, params);
                    client.release();
                    return result;
                },
                (ex) => {
                    console.log(`Error executing query: ${sql}`);
                    client.release();
                    return ex as Error;
                }
            )
        }),
        TE.flatten
    );
};

const deleteClient = (pool: Pool) => (clientName: string): TaskEither<Error, QueryResult<any>> => {
    const sql = 'DELETE FROM dev.clients WHERE client_name = $1';
    return safelyExecuteQuery<any>(pool, sql, [clientName]);
}
