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

import React, { useCallback, useEffect } from 'react';
import { UserAuthDetails } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/pipeable';
import { getAuthDetailsForClient } from '../../../../../services/ClientService';
import { map } from 'fp-ts/es6/Either';
import { Grid, Typography } from '@material-ui/core';
import './ClientAuths.scss';
import List, { Item } from '../../../../ui/List';
import { LockOpen } from '@material-ui/icons';
import { formatApiDateTime } from '../../../../../utils/date';
import { revokeUserAuthAccess } from '../../../../../services/UserService';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import { SectionHeader } from '@craigmiller160/react-material-ui-common';

interface Props extends IdMatchProps {}

interface State {
    clientId: number;
    clientName: string;
    userAuthDetails: Array<UserAuthDetails>;
}

const ClientAuths = (props: Props) => {
    const id = props.match.params.id;
    const [state, setState] = useImmer<State>({
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        clientName: '',
        userAuthDetails: []
    });

    const loadAuthDetails = useCallback(async () =>
        pipe(
            await getAuthDetailsForClient(state.clientId),
            map((clientAuthDetails) => {
                setState((draft) => {
                    draft.clientName = clientAuthDetails.clientName;
                    draft.userAuthDetails = clientAuthDetails.userAuthDetails;
                });
            })
        ), [state.clientId, setState]);

    const doRevoke = async (userId: number) =>
        pipe(
            await revokeUserAuthAccess(userId, state.clientId),
            map(() => loadAuthDetails())
        );

    useEffect(() => {
        loadAuthDetails();
    }, [loadAuthDetails]);

    const items: Array<Item> = state.userAuthDetails
        .map((auth) => ({
            avatar: () => <LockOpen />,
            text: {
                primary: `User: ${auth.userEmail}`,
                secondary: `Last Authenticated: ${formatApiDateTime(auth.lastAuthenticated)}`
            },
            secondaryActions: [
                {
                    text: 'Revoke',
                    click: () => doRevoke(auth.userId)
                }
            ]
        }));

    return (
        <div id="client-auths-page" className="ClientAuths">
            <SectionHeader
                id="client-auths-title"
                title={ state.clientName }
                noDivider
            />
            <Grid
                container
                direction="row"
                justify="center"
            >
                <Grid
                    item
                    md={ 5 }
                >
                    {
                        items.length > 0 &&
                        <List
                            id="client-auths-list"
                            items={ items }
                        />
                    }
                    {
                        items.length === 0 &&
                        <Typography
                            id="no-auths-msg"
                            className="no-auths"
                            variant="body1"
                        >
                            No Authorizations
                        </Typography>
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default ClientAuths;
