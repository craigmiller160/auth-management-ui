import React, { useEffect, useMemo } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { UserAuthDetails, UserAuthDetailsList, UserClient } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { getAllUserAuthDetails } from '../../../../../services/UserService';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse, map } from 'fp-ts/es6/Either';

interface Props {
    clients: Array<UserClient>;
    userId: number;
}

interface State {
    authDetails: Array<UserAuthDetails>;
}

const UserAuth = (props: Props) => {
    const {
        userId,
        clients
    } = props;
    const [state, setState] = useImmer<State>({
        authDetails: []
    });

    useEffect(() => {
        const action = async () => {
            const authDetails = pipe(
                await getAllUserAuthDetails(userId),
                map((list: UserAuthDetailsList) => list.authDetails),
                getOrElse((): Array<UserAuthDetails> => [])
            );
            setState((draft) => {
                draft.authDetails = authDetails;
            });
        };

        if (clients.length > 0) {
            action();
        }
    }, [setState, clients, userId]);

    const auths = useMemo(() =>
        state.authDetails
            .filter((auth) => auth.tokenId),
        [state.authDetails]);

    return (
        <>
            <SectionHeader title="Authentication" />
        </>
    );
};

export default UserAuth;
