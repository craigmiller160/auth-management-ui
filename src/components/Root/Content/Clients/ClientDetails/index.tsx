import React, { ChangeEvent, useEffect } from 'react';
import { Prompt, useHistory, useRouteMatch } from 'react-router';
import { isSome, Option } from 'fp-ts/es6/Option';
import {
    createClient,
    deleteClient,
    generateGuid,
    getClient,
    updateClient
} from '../../../../../services/ClientService';
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
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
}

interface MatchParams {
    id: string;
}

interface ClientForm extends Omit<Client, 'id'> { }

const defaultClient: Client = {
    id: 0,
    name: '',
    clientKey: '',
    clientSecret: '',
    enabled: false,
    allowClientCredentials: false,
    allowAuthCode: false,
    allowPassword: false,
    refreshTokenTimeoutSecs: 0,
    accessTokenTimeoutSecs: 0
};

const NEW = 'new';

// TODO improve the use of literal strings here

const isStringProperty = (name: string): name is 'name' | 'clientKey' | 'clientSecret' => {
    return name === 'name' || name === 'clientKey' || name === 'clientSecret';
};

const isNumberProperty = (name: string): name is 'accessTokenTimeoutSecs' | 'refreshTokenTimeoutSecs' => {
    return name === 'accessTokenTimeoutSecs' || name === 'refreshTokenTimeoutSecs';
};

const isBooleanProperty = (name: string): name is 'enabled' | 'allowClientCredentials' | 'allowPassword' | 'allowAuthCode' => {
    return name === 'enabled' || name === 'allowClientCredentials'
        || name === 'allowPassword' || name === 'allowAuthCode';
};

const ClientDetails = () => {
    const history = useHistory();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        client: {},
        shouldBlockNavigation: true,
        showDeleteDialog: false
    });
    const { register, handleSubmit, errors } = useForm<ClientForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const doSubmit = async (action: () => Promise<Option<any>>) => {
        const result = await action();
        if (isSome(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/clients');
        }
    };

    const onSubmit = () => {
        const payload: Client = {
            ...defaultClient,
            ...state.client
        };
        if (id === NEW) {
            doSubmit(() => createClient(payload));
        } else {
            doSubmit(() => updateClient(parseInt(id), payload));
        }
    };

    useEffect(() => {
        const action = async () => {
            if (id === NEW) {
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

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;
        setState((draft) => {
            if (isStringProperty(name)) {
                draft.client[name] = value;
            } else if (isNumberProperty(name)) {
                draft.client[name] = value ? parseInt(value) : 0;
            } else if (isBooleanProperty(name)) {
                draft.client[name] = checked;
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

    const doCancel = () => history.push('/clients');

    const toggleDeleteDialog = (show: boolean) => setState((draft) => {
        draft.showDeleteDialog = show;
    });

    const doDelete = async () => {
        const result = await deleteClient(parseInt(id));
        if (isSome(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/clients');
        }
    };

    return (
        <>
            <Prompt
                when={ state.shouldBlockNavigation }
                message="Are you sure you want to leave? Any unsaved changes will be lost."
            />
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
                                    onChange={ inputChange }
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
                                    onChange={ inputChange }
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
                                    onChange={ inputChange }
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
                                    onChange={ inputChange }
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
                            onClick={ doCancel }
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
                        {
                            id !== NEW &&
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={ () => toggleDeleteDialog(true) }
                            >
                                Delete
                            </Button>
                        }
                    </Grid>
                </form>
                <ConfirmDialog
                    open={ state.showDeleteDialog }
                    title="Delete Client"
                    message="Are you sure you want to delete this client?"
                    onConfirm={ doDelete }
                    onCancel={ () => toggleDeleteDialog(false) }
                />
            </div>
        </>
    );
};

export default ClientDetails;
