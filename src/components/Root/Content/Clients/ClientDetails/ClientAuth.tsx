import React, { useEffect } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { Typography } from '@material-ui/core';
import './ClientAuth.scss';
import { pipe } from 'fp-ts/es6/pipeable';
import { getClientAuthDetails, revokeClientAuthAccess } from '../../../../../services/ClientService';
import { getOrElse } from 'fp-ts/es6/Either';
import { ClientAuthDetails } from '../../../../../types/client';
import { useImmer } from 'use-immer';
import Grid from '@material-ui/core/Grid';
import List, { Item } from '../../../../ui/List';
import { LockOpen } from '@material-ui/icons';
import { fromNullable, map as oMap, getOrElse as oGetOrElse } from 'fp-ts/es6/Option';
import { displayFormatApiDateTime } from '../../../../../utils/date';

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

    const doRevoke = async () => {
        const authDetails = pipe(
            await revokeClientAuthAccess(clientId),
            getOrElse((): ClientAuthDetails => defaultAuthDetails)
        );
        setState((draft) => {
            draft.authDetails = authDetails;
        });
    };

    const lastAuthenticated: string | null = pipe(
        fromNullable(state.authDetails.lastAuthenticated),
        oMap((lastAuth: string) => displayFormatApiDateTime(lastAuth)),
        oGetOrElse((): string | null => null)
    );

    const items: Array<Item> = [];
    if (state.authDetails.tokenId) {
        items.push({
            avatar: () => <LockOpen />,
            text: {
                primary: `Client: ${state.authDetails.clientName}`,
                secondary: `Last Authenticated: ${lastAuthenticated}`
            },
            secondaryActions: [
                {
                    text: 'Revoke',
                    click: doRevoke
                }
            ]
        });
    }

    return (
        <div className="ClientAuth">
            <SectionHeader title="Authentication Status" />
            {
                !allowClientCreds &&
                <Typography variant="body1" className="NoAuthMsg">Client Credentials Authentication Not Allowed</Typography>
            }
            {
                allowClientCreds && items.length > 0 &&
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
                allowClientCreds && items.length === 0 &&
                <Typography variant="body1" className="NoAuthMsg">Not Authenticated</Typography>
            }
        </div>
    );
};

export default ClientAuth;
