import React, { useEffect } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { Typography } from '@material-ui/core';
import './ClientAuth.scss';
import { pipe } from 'fp-ts/es6/pipeable';
import { getClientAuthDetails } from '../../../../../services/ClientService';
import { getOrElse } from 'fp-ts/es6/Either';
import { ClientAuthDetails } from '../../../../../types/client';
import { useImmer } from 'use-immer';

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

    return (
        <div className="ClientAuth">
            <SectionHeader title="Authentication Status" />
            {
                !allowClientCreds &&
                <Typography variant="h6" className="NotAllowed">Client Credentials Authentication Not Allowed</Typography>
            }
            {
                allowClientCreds &&
                    <div>
                        <p>Client ID: { state.authDetails.clientId }</p>
                        <p>Client Name: { state.authDetails.clientName }</p>
                    </div>
            }
        </div>
    );
};

export default ClientAuth;
