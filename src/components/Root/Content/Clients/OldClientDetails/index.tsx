import React, { useEffect } from 'react';
import { Prompt, useHistory, useRouteMatch } from 'react-router';
import {
    createClient,
    deleteClient,
    generateGuid,
    getClient,
    getRolesForClient,
    updateClient
} from '../../../../../services/ClientService';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import './ClientDetails.scss';
import Button from '@material-ui/core/Button';
import { PageHeader, SectionHeader } from '../../../../ui/Header';
import { ConfirmDialog } from '../../../../ui/Dialog';
import { useImmer } from 'use-immer';
import { greaterThanZero } from '../../../../../utils/validations';
import alertSlice from '../../../../../store/alert/slice';
import { useDispatch } from 'react-redux';
import ClientUsers from './ClientUsers';
import ClientRoles from './ClientRoles';
import TextField from '../../../../ui/Form/TextField';
import Checkbox from '../../../../ui/Form/Checkbox';
import { pipe } from 'fp-ts/es6/pipeable';
import { Either, getOrElse, isRight } from 'fp-ts/es6/Either';
import { ClientDetails, ClientInput, ClientRole, ClientUser, FullClientDetails } from '../../../../../types/client';

interface State {
    clientId: number;
    users: Array<ClientUser>;
    roles: Array<ClientRole>;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
}

interface MatchParams {
    id: string;
}

interface ClientForm extends Omit<ClientDetails, 'id'> {
    clientSecret: string;
}
const NEW = 'new';

const defaultClient: ClientDetails = {
    id: 0,
    name: '',
    clientKey: '',
    enabled: false,
    refreshTokenTimeoutSecs: 0,
    accessTokenTimeoutSecs: 0,
    authCodeTimeoutSecs: 0
};
const defaultClientForm: ClientForm = {
    ...defaultClient,
    clientSecret: ''
};
const defaultFullClient: FullClientDetails = {
    ...defaultClient,
    users: [],
    roles: []
};

const ClientDetailsComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        clientId: id !== NEW ? parseInt(id) : 0,
        users: [],
        roles: [],
        shouldBlockNavigation: true,
        showDeleteDialog: false
    });
    const { handleSubmit, errors, reset, control, setValue } = useForm<ClientForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultClientForm
    });

    const doSubmit = async (action: () => Promise<Either<Error, ClientDetails>>) => {
        const result = await action();
        if (isRight(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/clients');
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved client ${id}`));
        }
    };

    const onSubmit = (values: ClientForm) => {
        const payload: ClientInput = {
            ...values
        };

        if (id === NEW) {
            doSubmit(() => createClient(payload));
        } else {
            doSubmit(() => updateClient(parseInt(id), payload));
        }
    };

    const reloadRoles = async () => {
        const roles = pipe(
            await getRolesForClient(parseInt(id)),
            getOrElse((): Array<ClientRole> => ([]))
        );
        setState((draft) => {
            draft.roles = roles;
        });
    };

    const updateUsers = (users: Array<ClientUser>) => {
        setState((draft) => {
            draft.users = users;
        });
    };

    useEffect(() => {
        const action = async () => {
            if (id === NEW) {
                const [key, secret] = await Promise.all([generateGuid(), generateGuid()]);
                if (isRight(key) && isRight(secret)) {
                    reset({
                        name: 'New Client',
                        clientKey: key.right,
                        clientSecret: secret.right,
                        enabled: true,
                        accessTokenTimeoutSecs: 300,
                        refreshTokenTimeoutSecs: 3600
                    });
                }
            } else {
                const client: FullClientDetails = pipe(
                    await getClient(parseInt(id)),
                    getOrElse((): FullClientDetails => defaultFullClient)
                );
                reset(client);
                setState((draft) => {
                    draft.users = client.users;
                    draft.roles = client.roles;
                });
            }
        };

        action();
    }, [id, setState, reset]);

    const generateClientKey = async () => {
        const guid = pipe(
            await generateGuid(),
            getOrElse((): string => '')
        );
        setValue('clientKey', guid);
    };

    const generateClientSecret = async () => {
        const guid = pipe(
            await generateGuid(),
            getOrElse((): string => '')
        );
        setValue('clientSecret', guid);
    };

    const doCancel = () => history.push('/userClients');

    const toggleDeleteDialog = (show: boolean) => setState((draft) => {
        draft.showDeleteDialog = show;
    });

    const doDelete = async () => {
        const result = await deleteClient(parseInt(id));
        if (isRight(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/userClients');
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
                            name="name"
                            control={ control }
                            label="Client Name"
                            rules={ { required: 'Required' } }
                            error={ errors.name }
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
                                name="clientKey"
                                control={ control }
                                label="Client Key"
                                rules={ { required: 'Required' } }
                                error={ errors.clientKey }
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
                                name="clientSecret"
                                control={ control }
                                label="Client Secret"
                                error={ errors.clientSecret}
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
                    <SectionHeader title="Access" />
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                    >
                        <Checkbox
                            name="enabled"
                            control={ control }
                            label="Enabled"
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
                            name="accessTokenTimeoutSecs"
                            control={ control }
                            label="Access Token Timeout (Secs)"
                            type="number"
                            error={ errors.accessTokenTimeoutSecs }
                            rules={ {
                                required: 'Required',
                                validate: {
                                    greaterThanZero
                                }
                            } }
                            transform={ (value: string) => value ? parseInt(value) : '' }
                        />
                        <TextField
                            className="timeouts"
                            name="refreshTokenTimeoutSecs"
                            control={ control }
                            label="Refresh Token Timeout (Secs)"
                            type="number"
                            error={ errors.refreshTokenTimeoutSecs }
                            rules={ {
                                required: 'Required',
                                validate: {
                                    greaterThanZero
                                }
                            } }
                            transform={ (value: string) => value ? parseInt(value) : '' }
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
                {
                    id !== NEW &&
                    <>
                        <Grid
                            container
                            direction="row"
                            className="UsersAndRoles"
                        >
                            <ClientUsers
                                users={ state.users }
                                clientId={ state.clientId }
                                updateUsers={ updateUsers }
                            />
                            <Grid item md={ 2 } />
                            <ClientRoles
                                clientId={ state.clientId ?? 0 }
                                roles={ state.roles }
                                reloadRoles={ reloadRoles }
                            />
                        </Grid>
                    </>
                }
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

export default ClientDetailsComponent;
