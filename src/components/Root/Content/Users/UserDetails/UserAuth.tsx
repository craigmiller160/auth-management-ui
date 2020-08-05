import React, { useEffect, useMemo } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { UserAuthDetails, UserAuthDetailsList, UserClient } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { getAllUserAuthDetails } from '../../../../../services/UserService';
import { pipe } from 'fp-ts/es6/pipeable';
import { getOrElse, map } from 'fp-ts/es6/Either';
import List, { Item } from '../../../../ui/List';
import { LockOpen } from '@material-ui/icons';
import { displayFormatApiDateTime } from '../../../../../utils/date';
import { Typography } from '@material-ui/core';
import { fromNullable, map as oMap, getOrElse as oGetOrElse } from 'fp-ts/es6/Option';
import Grid from '@material-ui/core/Grid';

interface Props {
    clients: Array<UserClient>;
    userId: number;
}

interface State {
    authDetails: Array<UserAuthDetails>;
}

const formatDate = (date: string | null): string =>
    pipe(
        fromNullable(date),
        oMap((value: string): string => displayFormatApiDateTime(value)),
        oGetOrElse((): string => '')
    );

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

    const items: Array<Item> = state.authDetails
        .filter((auth) => auth.tokenId)
        .map((auth) => ({
            avatar: () => <LockOpen />,
            text: {
                primary: `Token ID: ${auth.tokenId}`, // TODO change this
                secondary: `Last Authenticated: ${formatDate(auth.lastAuthenticated)}`
            },
            secondaryActions: [
                {
                    text: 'Revoke',
                    click: () => {}
                }
            ]
        }));

    return (
        <div>
            <SectionHeader title="Authentication" />
            {
                items.length > 0 &&
                    <Grid
                        container
                        direction="row"
                        justify="center"
                    >
                        <Grid item md={ 6 }>
                            <List items={ items } />
                        </Grid>
                    </Grid>
            }
            {
                items.length === 0 &&
                <Typography variant="body1" className="NoAuthMsg">Not Authenticated</Typography>
            }
        </div>
    );
};

export default UserAuth;
