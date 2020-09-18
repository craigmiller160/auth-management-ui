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

import React, { useEffect } from 'react';
import './UserAuths.scss';
import { pipe } from 'fp-ts/es6/pipeable';
import { getAllUserAuthDetails, revokeUserAuthAccess } from '../../../../../services/UserService';
import { getOrElse, map } from 'fp-ts/es6/Either';
import { UserAuthDetails, UserAuthDetailsList } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import List, { Item } from '../../../../ui/List';
import { LockOpen } from '@material-ui/icons';
import { formatApiDateTime } from '../../../../../utils/date';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';

interface State {
    userId: number;
    userAuths: UserAuthDetailsList;
}
interface Props extends IdMatchProps {}

const defaultUserAuths: UserAuthDetailsList = {
    email: '',
    authDetails: []
};

const UserAuths = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW_ID ? parseInt(id) : 0,
        userAuths: defaultUserAuths
    });

    useEffect(() => {
        const action = async () => {
            const userAuths = pipe(
                await getAllUserAuthDetails(state.userId),
                getOrElse((): UserAuthDetailsList => defaultUserAuths)
            );
            setState((draft) => {
                draft.userAuths = userAuths;
            });
        };

        action();
    }, [setState, state.userId]);

    const doRevoke = async (clientId: number) => {
        const authDetails = pipe(
            await revokeUserAuthAccess(state.userId, clientId),
            map(() =>
                state.userAuths.authDetails
                    .filter((auth) => auth.clientId !== clientId)
            ),
            getOrElse((): Array<UserAuthDetails> => state.userAuths.authDetails)
        );
        setState((draft) => {
            draft.userAuths.authDetails = authDetails;
        });
    };

    const items: Array<Item> = state.userAuths.authDetails
        .filter((auth) => auth.tokenId)
        .map((auth) => ({
            avatar: () => <LockOpen />,
            text: {
                primary: `Client: ${auth.clientName}`,
                secondary: `Last Authenticated: ${formatApiDateTime(auth.lastAuthenticated)}`
            },
            secondaryActions: [
                {
                    text: 'Revoke',
                    click: () => doRevoke(auth.clientId)
                }
            ]
        }));

    return (
        <div className="UserAuths">
            <Typography
                className="email"
                variant="h5"
            >
                { state.userAuths.email }
            </Typography>
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
                <Grid
                    container
                    direction="row"
                    justify="center"
                >
                    <Typography variant="body1">Not Authenticated</Typography>
                </Grid>
            }
        </div>
    );
};

export default UserAuths;
