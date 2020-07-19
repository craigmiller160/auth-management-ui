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
import alertSlice from '../../../../../store/alert/slice';
import { useDispatch } from 'react-redux';
import { assignProperty } from '../../../../../utils/propertyTypes';
import {
    handleCheckbox,
    HandledChangeEvent, handleNumberField,
    handleTextField,
    SupportedHandledChangeTypes
} from '../../../../../utils/changeHandlers';

interface State {
    client: Partial<Client>;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
}

interface MatchParams {
    id: string;
}

interface ClientForm extends Omit<Client, 'id'> { }
const NEW = 'new';
const NAME = 'name';
const CLIENT_KEY = 'clientKey';
const CLIENT_SECRET = 'clientSecret';
const ACCESS_TOKEN_TIMEOUT = 'accessTokenTimeoutSecs';
const REFRESH_TOKEN_TIMEOUT = 'refreshTokenTimeoutSecs';
const ENABLED = 'enabled';
const ALLOW_CLIENT_CREDS = 'allowClientCredentials';
const ALLOW_PASSWORD = 'allowPassword';
const ALLOW_AUTH_CODE = 'allowAuthCode';

const STRING_PROPS = [NAME, CLIENT_KEY, CLIENT_SECRET];
const NUMBER_PROPS = [ACCESS_TOKEN_TIMEOUT, REFRESH_TOKEN_TIMEOUT];
const BOOLEAN_PROPS = [ENABLED, ALLOW_CLIENT_CREDS, ALLOW_PASSWORD, ALLOW_AUTH_CODE];

type ClientStringProperty = typeof NAME | typeof CLIENT_KEY | typeof CLIENT_SECRET;
type ClientNumberProperty = typeof ACCESS_TOKEN_TIMEOUT | typeof REFRESH_TOKEN_TIMEOUT;
type ClientBooleanProperty = typeof ENABLED | typeof ALLOW_CLIENT_CREDS | typeof ALLOW_PASSWORD | typeof ALLOW_AUTH_CODE;

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

const isStringProperty = (name: string): name is ClientStringProperty => {
    return STRING_PROPS.includes(name);
};

const isNumberProperty = (name: string): name is ClientNumberProperty => {
    return NUMBER_PROPS.includes(name);
};

const isBooleanProperty = (name: string): name is ClientBooleanProperty => {
    return BOOLEAN_PROPS.includes(name);
};

const ClientDetails = () => {
    const dispatch = useDispatch();
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
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved client ${result.value.id}`));
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

    const inputChange = (event: HandledChangeEvent<SupportedHandledChangeTypes>) => {
        setState((draft) => {
            assignProperty(draft.client, event.name, event.value);
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
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully deleted client ${id}`));
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
                            name={ NAME }
                            value={ state.client.name ?? '' }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => handleTextField(event, inputChange) }
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
                                name={ CLIENT_KEY }
                                value={ state.client.clientKey ?? '' }
                                onChange={ (event: ChangeEvent<HTMLInputElement>) => handleTextField(event, inputChange) }
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
                                name={ CLIENT_SECRET }
                                value={ state.client.clientSecret ?? '' }
                                onChange={ (event: ChangeEvent<HTMLInputElement>) => handleTextField(event, inputChange) }
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
                                    name={ ENABLED }
                                    checked={ state.client.enabled ?? false }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => handleCheckbox(event, inputChange) }
                                    color="primary"
                                />
                            }
                        />
                        <FormControlLabel
                            label="Client Credentials Grant"
                            control={
                                <Checkbox
                                    name={ ALLOW_CLIENT_CREDS }
                                    checked={ state.client.allowClientCredentials ?? false }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => handleCheckbox(event, inputChange) }
                                    color="primary"
                                />
                            }
                        />
                        <FormControlLabel
                            label="Password Grant"
                            control={
                                <Checkbox
                                    name={ ALLOW_PASSWORD }
                                    checked={ state.client.allowPassword ?? false }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => handleCheckbox(event, inputChange) }
                                    color="primary"
                                />
                            }
                        />
                        <FormControlLabel
                            label="Authorization Code Grant"
                            control={
                                <Checkbox
                                    name={ ALLOW_AUTH_CODE }
                                    checked={ state.client.allowAuthCode ?? false }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) => handleCheckbox(event, inputChange) }
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
                            name={ ACCESS_TOKEN_TIMEOUT }
                            value={ state.client.accessTokenTimeoutSecs ?? '' }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => handleNumberField(event, inputChange) }
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
                            name={ REFRESH_TOKEN_TIMEOUT }
                            value={ state.client.refreshTokenTimeoutSecs ?? '' }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => handleNumberField(event, inputChange) }
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
