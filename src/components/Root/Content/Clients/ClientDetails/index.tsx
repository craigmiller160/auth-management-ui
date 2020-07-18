import React, { ChangeEvent, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import { isSome } from 'fp-ts/es6/Option';
import { generateGuid, getClient } from '../../../../../services/ClientService';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Client } from '../../../../../types/api';
import { useForm } from 'react-hook-form';
import './ClientDetails.scss';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { PageHeader, SectionHeader } from '../../../../ui/Header';
import ConfirmDialog from '../../../../ui/Dialog/ConfirmDialog';
import { useImmer } from 'use-immer';

interface State {
    client: Partial<Client>;
    dialog: {
        show: boolean;
        title: string;
        message: string;
    };
}

interface MatchParams {
    id: string;
}

const ClientDetails = () => {
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        client: {},
        dialog: {
            show: false,
            title: '',
            message: ''
        }
    });
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data: any) => console.log('Submit', data); // TODO input argument should not be any, find an alternative

    useEffect(() => {
        const action = async () => {
            // TODO need to handle the 'new' scenario
            const result = await getClient(parseInt(id));
            if (isSome(result)) {
                setState((draft) => {
                    draft.client = result.value;
                });
            } else {
                setState((draft) => {
                    draft.client = {};
                });
            }
        };

        action();
    }, [id, setState]);

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState((draft) => {
            // draft.client[event.target.name] = event.target.value; // TODO find a way to make this work
            switch (name) {
                case 'clientKey':
                    draft.client.clientKey = value;
                    break;
                case 'clientSecret':
                    draft.client.clientSecret = value;
                    break;
                case 'accessTokenTimeoutSecs':
                    draft.client.accessTokenTimeoutSecs = value ? parseInt(value) : 0;
                    break;
                case 'refreshTokenTimeoutSecs':
                    draft.client.refreshTokenTimeoutSecs = value ? parseInt(value) : 0;
                    break;
            }
        });
    };

    const checkboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setState((draft) => {
            // draft.client[event.target.name] = event.target.checked; // TODO find a way to make this work
            switch (name) {
                case 'enabled':
                    draft.client.enabled = checked;
                    break;
                case 'allowClientCredentials':
                    draft.client.allowClientCredentials = checked;
                    break;
                case 'allowPassword':
                    draft.client.allowPassword = checked;
                    break;
                case 'allowAuthCode':
                    draft.client.allowAuthCode = checked;
                    break;
            }
        });
    };

    const generateClientKey = async () => {
        const guid = await generateGuid();
        if (isSome(guid)) {
            setState((draft) => {
                draft.client.clientKey = guid.value;
            });
        }
    };

    const generateClientSecret = async () => {
        const guid = await generateGuid();
        if (isSome(guid)) {
            setState((draft) => {
                draft.client.clientSecret = guid.value;
            });
        }
    };

    // TODO access and refresh tokens should require value > 0

    return (
        <div className="ClientDetails">
            <PageHeader title="Client Details" />
            <SectionHeader title="Keys" />
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
                <SectionHeader title="Grants" />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                >
                    <FormControlLabel
                        label="Enabled"
                        control={
                            <Checkbox
                                name="enabled"
                                checked={ state.client.enabled ?? false }
                                onChange={ checkboxChange }
                                color="primary"
                            />
                        }
                    />
                    <FormControlLabel
                        label="Client Credentials Grant"
                        control={
                            <Checkbox
                                name="allowClientCredentials"
                                checked={ state.client.allowClientCredentials ?? false }
                                onChange={ checkboxChange }
                                color="primary"
                            />
                        }
                    />
                    <FormControlLabel
                        label="Password Grant"
                        control={
                            <Checkbox
                                name="allowPassword"
                                checked={ state.client.allowPassword ?? false }
                                onChange={ checkboxChange }
                                color="primary"
                            />
                        }
                    />
                    <FormControlLabel
                        label="Authorization Code Grant"
                        control={
                            <Checkbox
                                name="allowAuthCode"
                                checked={ state.client.allowAuthCode ?? false }
                                onChange={ checkboxChange }
                                color="primary"
                            />
                        }
                    />
                </Grid>
                <SectionHeader title="Timeouts" />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                >
                    <TextField
                        className="timeouts"
                        type="number"
                        label="Access Token Timeout (Secs)"
                        name="accessTokenTimeoutSecs"
                        value={ state.client.accessTokenTimeoutSecs ?? '' }
                        onChange={ inputChange }
                        inputRef={ register({ required: true }) }
                        error={ !!errors.accessTokenTimeoutSecs }
                    />
                    <TextField
                        className="timeouts"
                        type="number"
                        label="Refresh Token Timeout (Secs)"
                        name="refreshTokenTimeoutSecs"
                        value={ state.client.refreshTokenTimeoutSecs ?? '' }
                        onChange={ inputChange }
                        inputRef={ register({ required: true }) }
                        error={ !!errors.refreshTokenTimeoutSecs }
                    />
                </Grid>
                <SectionHeader title="Actions" />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                >
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Delete
                    </Button>
                </Grid>
            </form>
            <ConfirmDialog
                open={ state.dialog.show }
                title={ state.dialog.title }
                message={ state.dialog.message }
            />
        </div>
    );
};

export default ClientDetails;
