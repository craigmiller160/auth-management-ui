import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Client } from '../../../../../types/api';
import { none, Option } from 'fp-ts/es6/Option';
import { getClient } from '../../../../../services/ClientService';

interface State {
    client: Option<Client>
}

interface MatchParams {
    id: string;
}

const ClientDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const [state, setState] = useState<State>({
        client: none
    });

    useEffect(() => {
        const action = async () => {
            const result = await getClient(parseInt(match.params.id));
            setState({
                client: result
            });
        };

        action();
    }, []);

    return (
        <h1>Client Details</h1>
    );
};

export default ClientDetails;
