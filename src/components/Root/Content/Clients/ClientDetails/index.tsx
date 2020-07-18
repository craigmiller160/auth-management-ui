import React, { ChangeEvent, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
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
import { greaterThanZero } from '../../../../../utils/validations';

interface State {
    client: Partial<Client>;
    showCancelDialog: boolean;
}

interface MatchParams {
    id: string;
}

interface ClientForm extends Omit<Client, 'id'> { }

// TODO when navigating away from this page with any link there should be the cancel modal

const ClientDetails = () => {
    const history = useHistory();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        client: {},
        showCancelDialog: false
    });
    const { register, handleSubmit, errors } = useForm<ClientForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });
    const onSubmit = (data: ClientForm) => console.log('Submit', data);

    useEffect(() => {
        const action = async () => {
            if (id === 'new') {
                const [key, secret] = await Promise.all([generateGuid(), generateGuid()]);
                if (isSome(key) && isSome(secret)) {
                    setState((draft) => {
                        draft.client = {
                            name: 'New Client',
                            clientKey: key.value,
                            clientSecret: secret.value,
                            enabled: true,
                            accessTokenTimeoutSecs: 300,
                            refreshTokenTimeoutSecs: 3600
                        };
                    });
                }
            } else {
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
            }
        };

        action();
    }, [id, setState]);

    const doCancel = () => {
        setState((draft) => {
            draft.showCancelDialog = false;
        });
        history.push('/clients');
    };
    const toggleCancelDialog = (show: boolean) => setState((draft) => {
        draft.showCancelDialog = show;
    });

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState((draft) => {
            // draft.client[event.target.name] = event.target.value; // TODO find a way to make this work
            switch (name) {
                case 'name':
                    draft.client.name = value;
                    break;
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

    return (
        <div className="ClientDetails">
            <PageHeader title="Client Details" />
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid
                    container
                    direction="row"
                    justify="center"
                >
                    <TextField
                        className="grow-sm"
                        label="Client Name"
                        name="name"
                        value={ state.client.name ?? '' }
                        onChange={ inputChange }
                        inputRef={ register({ required: 'Required' }) }
                        error={ !!errors.name }
                        helperText={ errors.name?.message ?? '' }
                    />
                </Grid>
                <SectionHeader title="Keys" />
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
                            inputRef={ register({ required: 'Required' }) }
                            error={ !!errors.clientKey }
                            helperText={ errors.clientKey?.message ?? '' }
                            disabled
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
                            helperText={ errors.clientSecret?.message ?? '' }
                            disabled
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
                        inputRef={ register({
                            required: 'Required',
                            validate: {
                                greaterThanZero
                            }
                        }) }
                        error={ !!errors.accessTokenTimeoutSecs }
                        helperText={ errors.accessTokenTimeoutSecs?.message ?? '' }
                    />
                    <TextField
                        className="timeouts"
                        type="number"
                        label="Refresh Token Timeout (Secs)"
                        name="refreshTokenTimeoutSecs"
                        value={ state.client.refreshTokenTimeoutSecs ?? '' }
                        onChange={ inputChange }
                        inputRef={ register({
                            required: 'Required',
                            validate: {
                                greaterThanZero
                            }
                        }) }
                        error={ !!errors.refreshTokenTimeoutSecs }
                        helperText={ errors.refreshTokenTimeoutSecs?.message ?? '' }
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
                        onClick={ () => toggleCancelDialog(true) }
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
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
                open={ state.showCancelDialog }
                title="Cancel Changes"
                message="Are you sure you want to cancel all changes?"
                onConfirm={ doCancel }
                onCancel={ () => toggleCancelDialog(false) }
            />
        </div>
    );
};

export default ClientDetails;
