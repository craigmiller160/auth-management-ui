import React, { useEffect } from 'react';
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
import { Client, Role, User } from '../../../../../types/api';
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
import { createChangeHandler, HandledChangeEvent } from '../../../../../utils/changeHandlers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';

interface State {
    client: Partial<Client>;
    users: Array<User>;
    roles: Array<Role>;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
}

interface MatchParams {
    id: string;
}

interface ClientForm extends Omit<Client, 'id'> { }
const NEW = 'new';

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

const ClientDetails = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        client: {},
        users: [],
        roles: [],
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
                        draft.client = result.value.client;
                        draft.users = result.value.users;
                        draft.roles = result.value.roles;
                    });
                } else {
                    setState((draft) => {
                        draft.client = {};
                        draft.users = [];
                        draft.roles = [];
                    });
                }
            }
        };

        action();
    }, [id, setState]);

    const inputChange = (event: HandledChangeEvent) => {
        setState((draft) => {
            assignProperty(draft.client, event.name, event.value);
        });
    };
    const changeHandler = createChangeHandler(inputChange);

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
                            name="name"
                            value={ state.client.name ?? '' }
                            onChange={ changeHandler.handleTextField }
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
                                onChange={ changeHandler.handleTextField }
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
                                onChange={ changeHandler.handleTextField }
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
                                    onChange={ changeHandler.handleCheckbox }
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
                                    onChange={ changeHandler.handleCheckbox }
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
                                    onChange={ changeHandler.handleCheckbox }
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
                                    onChange={ changeHandler.handleCheckbox }
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
                            onChange={ changeHandler.handleNumberField }
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
                            onChange={ changeHandler.handleNumberField }
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
                <Grid
                    container
                    direction="row"
                    className="UsersAndRoles"
                >
                    <Grid
                        item
                        md={ 5 }
                    >
                        <SectionHeader title="Users" />
                        <List>
                            {
                                state.users.map((user, index) => (
                                    <ListItem key={ index }>
                                        <ListItemAvatar>
                                            <PersonIcon />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={ user.email }
                                            secondary={ `${user.firstName} ${user.lastName}` }
                                        />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Grid>
                    <Grid item md={ 2 } />
                    <Grid
                        item
                        md={ 5 }
                    >
                        <SectionHeader title="Roles" />
                    </Grid>
                </Grid>
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
