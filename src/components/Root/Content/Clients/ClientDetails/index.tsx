import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { isSome } from 'fp-ts/es6/Option';
import { generateGuid, getClient } from '../../../../../services/ClientService';
import PageHeader from '../../../../ui/PageHeader/PageHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Client } from '../../../../../types/api';
import { useForm } from 'react-hook-form';
import './ClientDetails.scss';
import Button from '@material-ui/core/Button';

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
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data: any) => console.log('Submit', data); // TODO input argument should not be any, find an alternative

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

    const generateClientKey = async () => {
        const guid = await generateGuid();
        if (isSome(guid)) {
            setState({
                client: {
                    ...state.client,
                    clientKey: guid.value
                }
            });
        }
    };

    const generateClientSecret = async () => {
        const guid = await generateGuid();
        if (isSome(guid)) {
            setState({
                client: {
                    ...state.client,
                    clientSecret: guid.value
                }
            });
        }
    };

    return (
        <div className="ClientDetails">
            <PageHeader title="Client Details" />
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid
                    container
                    direction="row"
                >
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        className="half-row"
                    >
                        <TextField
                            className="grow"
                            label="Client Key"
                            name="clientKey"
                            value={ state.client.clientKey ?? '' }
                            onChange={ inputChange }
                            inputRef={ register({ required: true }) }
                            error={ !!errors.clientKey }
                        />
                        <Button
                            variant="text"
                            color="default"
                            onClick={ generateClientKey }
                        >
                            Generate
                        </Button>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        className="half-row"
                    >
                        <TextField
                            className="grow"
                            label="Client Secret"
                            name="clientSecret"
                            value={ state.client.clientSecret ?? '' }
                            onChange={ inputChange }
                            inputRef={ register }
                            error={ !!errors.clientSecret }
                        />
                        <Button
                            variant="text"
                            color="default"
                            onClick={ generateClientSecret }
                        >
                            Generate
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default ClientDetails;
