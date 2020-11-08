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

import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Table from '../../../ui/Table';
import Button from '@material-ui/core/Button';
import './Users.scss';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { PageHeader } from '@craigmiller160/react-material-ui-common';
import { UserDetails, UserList } from '../../../../types/user';
import { getAllUsers } from '../../../../services/UserService';

interface State {
    users: Array<UserDetails>;
}

const header = [ 'Email', 'First Name', 'Last Name' ];

const Users = () => {
    const history = useHistory();
    const [ state, setState ] = useState<State>({
        users: []
    });

    useEffect(() => {
        const action = async () => {
            const users = pipe(
                await getAllUsers(),
                map((list: UserList) => list.users),
                getOrElse((): Array<UserDetails> => ([]))
            );
            setState({
                users
            });
        };

        action();
    }, []);

    const newClick = () => history.push('/users/new');

    const body = useMemo(() =>
        state.users
            .map((user) => ({
                click: () => history.push(`/users/${user.id}`),
                items: [ user.email, user.firstName, user.lastName ]
            })),
    [ state.users, history ]);

    return (
        <div className="Users">
            <PageHeader title="Users" />
            <Grid
                container
                direction="row"
            >
                <Table
                    header={ header }
                    body={ body }
                />
            </Grid>
            <Grid
                container
                direction="row"
                className="actions"
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ newClick }
                >
                    New User
                </Button>
            </Grid>
        </div>
    );
};

export default Users;
