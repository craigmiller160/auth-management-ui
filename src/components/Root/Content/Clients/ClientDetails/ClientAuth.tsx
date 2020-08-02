import React, { useEffect } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { Typography } from '@material-ui/core';
import './ClientAuth.scss';
import { pipe } from 'fp-ts/es6/pipeable';
import { getClientAuthDetails } from '../../../../../services/ClientService';
import { getOrElse } from 'fp-ts/es6/Either';
import { ClientAuthDetails } from '../../../../../types/client';
import { useImmer } from 'use-immer';
import Grid from '@material-ui/core/Grid';
import List, { Item } from '../../../../ui/List';
import { LockOpen } from '@material-ui/icons';

interface Props {
    allowClientCreds: boolean;
    clientId: number;
}

interface State {
    authDetails: ClientAuthDetails;
}

const defaultAuthDetails: ClientAuthDetails = {
    tokenId: null,
    clientId: 0,
    clientName: '',
    lastAuthenticated: null
};

const ClientAuth = (props: Props) => {
    const {
        allowClientCreds,
        clientId
    } = props;

    const [state, setState] = useImmer<State>({
        authDetails: defaultAuthDetails
    });

    useEffect(() => {
        const action = async () => {
            const authDetails = pipe(
                await getClientAuthDetails(clientId),
                getOrElse((): ClientAuthDetails => defaultAuthDetails)
            );

            setState((draft) => {
                draft.authDetails = authDetails;
            });
        };

        if (allowClientCreds) {
            action();
        }
    }, [allowClientCreds, setState, clientId]);

    const items: Array<Item> = [
        {
            avatar: () => <LockOpen />,
            text: {
                primary: `Token ID: ${state.authDetails.tokenId}`,
                secondary: `Last Authenticated: ${state.authDetails.lastAuthenticated}`
            },
            secondaryActions: [
                {
                    text: 'Revoke',
                    click: () => {}
                }
            ]
        }
    ];

    // TODO need message for if there are no authentications

    return (
        <div className="ClientAuth">
            <SectionHeader title="Authentication Status" />
            {
                !allowClientCreds &&
                <Typography variant="body1" className="NotAllowed">Client Credentials Authentication Not Allowed</Typography>
            }
            {
                allowClientCreds &&
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
        </div>
    );
};

export default ClientAuth;
