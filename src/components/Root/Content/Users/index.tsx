import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../../ui/Header';
import { useHistory } from 'react-router';
import { User } from '../../../../types/oldApi';
import { getUsers } from '../../../../services/UserService';
import { isSome } from 'fp-ts/es6/Option';
import Grid from '@material-ui/core/Grid';
import Table from '../../../ui/Table';
import Button from '@material-ui/core/Button';
import './Users.scss';

interface State {
    users: Array<User>;
}

const header = ['Email', 'First Name', 'Last Name'];

const Users = () => {
    const history = useHistory();
    const [state, setState] = useState<State>({
        users: []
    });

    useEffect(() => {
        const action = async () => {
            const result = await getUsers();
            if (isSome(result)) {
                setState({
                    users: result.value.users
                });
            } else {
                setState({
                    users: []
                });
            }
        };

        action();
    }, []);

    const newClick = () => history.push('/users/new');

    const body = useMemo(() =>
        state.users
            .map((user) => ({
                click: () => history.push(`/users/${user.id}`),
                items: [user.email, user.firstName, user.lastName]
            })),
    [state.users, history]);

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
