import React, { useEffect } from 'react';
import { SectionHeader } from '../../../../ui/Header';
import { Typography } from '@material-ui/core';
import './ClientAuth.scss';

interface Props {
    allowClientCreds: boolean;
}

interface State {

}

const ClientAuth = (props: Props) => {
    const {
        allowClientCreds
    } = props;

    useEffect(() => {
        const action = async () => {
            // TODO load the client auth stuff here
        };

        if (allowClientCreds) {
            action();
        }
    }, [allowClientCreds]);

    return (
        <div className="ClientAuth">
            <SectionHeader title="Authentication Status" />
            {
                !allowClientCreds &&
                <Typography variant="h6" className="NotAllowed">Client Credentials Authentication Not Allowed</Typography>
            }
        </div>
    );
};

export default ClientAuth;
