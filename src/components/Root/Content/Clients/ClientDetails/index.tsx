import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { isSome } from 'fp-ts/es6/Option';
import { getClient } from '../../../../../services/ClientService';
import PageHeader from '../../../../ui/PageHeader/PageHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Client } from '../../../../../types/api';

interface State {
    client: Partial<Client>
}

interface MatchParams {
    id: string;
}

const ClientDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useState<State>({
        client: {}
    });

    useEffect(() => {
        const action = async () => {
            // TODO need to handle the 'new' scenario
            const result = await getClient(parseInt(id));
            if (isSome(result)) {
                setState({
                    client: result.value
                });
            } else {
                setState({
                    client: {}
                });
            }
        };

        action();
    }, [id]);

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            client: {
                ...state.client,
                [event.target.name]: event.target.value
            }
        });
    };

    return (
        <div>
            <PageHeader title="Client Details" />
            <Grid
                container
                direction="row"
            >
                <TextField
                    label="Client Key"
                    name="clientKey"
                    value={ state.client.clientKey ?? '' }
                    onChange={ inputChange }
                />
            </Grid>
        </div>
    );
};

export default ClientDetails;
