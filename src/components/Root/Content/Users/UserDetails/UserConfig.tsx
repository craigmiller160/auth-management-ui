import React, { useEffect } from 'react';
import { match } from 'react-router';
import { UserDetails } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { getUserDetails } from '../../../../../services/UserService';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse } from 'fp-ts/es6/Either';

interface State {
    userId: number;
    user: UserDetails;
}
const NEW = 'new';
interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

const defaultUser: UserDetails = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    enabled: true
};

const UserConfig = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        user: defaultUser
    });

    useEffect(() => {
        const action = async () => {
            const user = pipe(
                await getUserDetails(state.userId),
                getOrElse((): UserDetails => defaultUser)
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
        <div>
            <h1>User Config</h1>
        </div>
    );
};

export default UserConfig;
