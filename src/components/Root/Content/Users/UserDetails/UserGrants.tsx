import React, { useEffect } from 'react';
import { match } from 'react-router';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getUserClients } from '../../../../../services/UserService';
import { getOrElse } from 'fp-ts/es6/Either';
import { UserClients } from '../../../../../types/user';
import { Grid, Typography } from '@material-ui/core';
import './UserGrants.scss';

interface State {
    userId: number;
    user: UserClients;
}
const NEW = 'new';
interface MatchParams {
    id: string;
}
interface Props {
    match: match<MatchParams>;
}

const defaultUser: UserClients = {
    id: 0,
    email: '',
    clients: []
};

const UserGrants = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        user: defaultUser
    });

    useEffect(() => {
        const action = async () => {
            const user = pipe(
                await getUserClients(state.userId),
                getOrElse((): UserClients => defaultUser)
            );
            setState((draft) => {
                draft.user = user;
            });
        };

        if (state.userId > 0) {
            action();
        }
    }, [state.userId, setState]);

    return (
        <div className="UserGrants">
            <Typography
                className="email"
                variant="h5"
            >
                { state.user.email }
            </Typography>
            <Grid
                container
                direction="row"
                justify="space-around"
            >

            </Grid>
        </div>
    );
};

export default UserGrants;
