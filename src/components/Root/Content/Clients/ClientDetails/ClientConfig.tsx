/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect } from 'react';
import { Prompt, useHistory } from 'react-router';
import { ClientDetails, ClientInput } from '../../../../../types/client';
import { useDispatch } from 'react-redux';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import { Either, getOrElse, map } from 'fp-ts/es6/Either';
import { isRight } from 'fp-ts/es6/These';
import {
    createClient,
    deleteClient,
    generateGuid,
    getClientDetails,
    updateClient
} from '../../../../../services/ClientService';
import { pipe } from 'fp-ts/es6/pipeable';
import { Grid, Typography } from '@material-ui/core';
import TextField from '../../../../ui/Form/TextField';
import './ClientConfig.scss';
import Button from '@material-ui/core/Button';
import Switch from '../../../../ui/Form/Switch';
import { greaterThanZero } from '../../../../../utils/validations';
import List, { Item } from '../../../../ui/List';
import { Language } from '@material-ui/icons';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';
import InputDialog from '../../../../ui/Dialog/InputDialog';
import { ConfirmDialog, showSuccessReduxAlert } from '@craigmiller160/react-material-ui-common';

const SECRET_PLACEHOLDER = '**********';

interface State {
    allowNavigationOverride: boolean;
    showDeleteDialog: boolean;
    showRedirectUriDialog: boolean;
    clientId: number;
    redirectUris: Array<string>;
    selectedRedirectUri?: string;
    redirectUriDirty: boolean;
}

interface Props extends IdMatchProps {}

const defaultClient: ClientDetails = {
    id: 0,
    name: '',
    clientKey: '',
    enabled: false,
    refreshTokenTimeoutSecs: 0,
    accessTokenTimeoutSecs: 0,
    authCodeTimeoutSecs: 0,
    redirectUris: []
};

interface ClientForm extends ClientDetails {
    clientSecret: string;
}

const defaultClientForm: ClientForm = {
    ...defaultClient,
    clientSecret: ''
};

const ClientConfig = (props: Props) => {
    const id = props.match.params.id;
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useImmer<State>({
        allowNavigationOverride: false,
        showDeleteDialog: false,
        clientId: id !== NEW_ID ? parseInt(id) : 0,
        redirectUris: [],
        showRedirectUriDialog: false,
        redirectUriDirty: false
    });
    const { control, setValue, handleSubmit, errors, reset, formState: { isDirty } } = useForm<ClientForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultClientForm
    });

    const doSubmit = async (action: () => Promise<Either<Error, ClientDetails>>) => {
        pipe(
            await action(),
            map((client) => {
                setState((draft) => {
                    draft.clientId = client.id;
                    draft.redirectUriDirty = false;
                    draft.redirectUris = client.redirectUris;
                });
                reset(client);
                const path = props.match.path.replace(':id', `${client.id}`);
                dispatch(showSuccessReduxAlert(`Successfully saved client ${id}`));
                history.push(path);
            })
        );
    };

    const onSubmit = (values: ClientForm) => {
        const payload: ClientInput = {
            ...values,
            clientSecret: values.clientSecret !== SECRET_PLACEHOLDER ? values.clientSecret : '',
            redirectUris: state.redirectUris
        };
        if (state.clientId === 0) {
            doSubmit(() => createClient(payload));
        } else {
            doSubmit(() => updateClient(parseInt(id), payload));
        }
    };

    useEffect(() => {
        const loadClient = async () => {
            const client = pipe(
                await getClientDetails(state.clientId),
                getOrElse((): ClientDetails => defaultClient)
            );
            reset({
                ...client,
                clientSecret: SECRET_PLACEHOLDER
            });
            setState((draft) => {
                draft.redirectUris = client.redirectUris;
            });
        };

        const loadNewClient = async () => {
            const [key, secret] = await Promise.all([generateGuid(), generateGuid()]);
            if (isRight(key) && isRight(secret)) {
                reset({
                    ...defaultClientForm,
                    name: 'New Client',
                    clientKey: key.right,
                    clientSecret: secret.right,
                    enabled: true,
                    accessTokenTimeoutSecs: 300,
                    refreshTokenTimeoutSecs: 3600,
                    authCodeTimeoutSecs: 60
                });
                setState((draft) => {
                    draft.redirectUris = [];
                });
            }
        };

        if (state.clientId > 0) {
            loadClient();
        } else {
            loadNewClient();
        }
    }, [reset, state.clientId, setState]);

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

    const showRedirectUriDialog = (selectedUri?: string) =>
        setState((draft) => {
            draft.selectedRedirectUri = selectedUri;
            draft.showRedirectUriDialog = true;
        });

    const removeRedirectUri = (index: number) =>
        setState((draft) => {
            draft.redirectUris.splice(index, 1);
            draft.redirectUriDirty = true;
        });

    const redirectUris = state.redirectUris.slice()
        .sort((uri1, uri2) => uri1.localeCompare(uri2));

    const redirectUriItems: Array<Item> = redirectUris
        .map((uri, index) => ({
            avatar: () => <Language />,
            text: {
                primary: uri
            },
            secondaryActions: [
                {
                    text: 'Edit',
                    click: () => showRedirectUriDialog(uri)
                },
                {
                    text: 'Remove',
                    click: () => removeRedirectUri(index)
                }
            ]
        }));

    const cancelRedirectUri = () =>
        setState((draft) => {
            draft.showRedirectUriDialog = false;
        });

    const saveRedirectUri = (value: string) => {
        setState((draft) => {
            if (draft.selectedRedirectUri) {
                const index = draft.redirectUris
                    .findIndex((uri) => uri === draft.selectedRedirectUri);
                if (index >= 0) {
                    draft.redirectUris.splice(0, 1);
                }
            }
            draft.redirectUris.push(value);
            draft.redirectUris.sort((uri1, uri2) => uri1.localeCompare(uri2));
            draft.showRedirectUriDialog = false;
            draft.redirectUriDirty = true;
        });
    };

    const toggleDeleteDialog = (show: boolean) =>
        setState((draft) => {
            draft.showDeleteDialog = show;
        });

    const doDelete = async () => {
        const result = await deleteClient(state.clientId);
        if (isRight(result)) {
            setState((draft) => {
                draft.allowNavigationOverride = true;
            });
            history.push('/clients');
            dispatch(showSuccessReduxAlert(`Successfully deleted client ${id}`));
        }
    };

    return (
        <div className='ClientConfig'>
            <Prompt
                when={ (isDirty || state.redirectUriDirty || state.clientId === 0) && !state.allowNavigationOverride }
                message='Are you sure you want to leave? Any unsaved changes will be lost.'
            />
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid
                    container
                    direction='row'
                    justify='space-around'
                >
                    <Grid
                        container
                        direction='column'
                        item
                        md={ 5 }
                        alignItems='flex-start'
                    >
                        <TextField
                            id="client-name-field"
                            className='Field'
                            name='name'
                            control={ control }
                            label='Client Name'
                            rules={ { required: 'Required' } }
                            error={ errors.name }
                        />
                        <Grid
                            container
                            direction='row'
                        >
                            <TextField
                                id="client-key-field"
                                className='Field'
                                name='clientKey'
                                control={ control }
                                label='Client Key'
                                rules={ { required: 'Required' } }
                                error={ errors.clientKey }
                                disabled
                            />
                            <Button
                                id="client-key-generate-btn"
                                variant='text'
                                color='default'
                                onClick={ generateClientKey }
                            >
                                Generate
                            </Button>
                        </Grid>
                        <Grid
                            container
                            direction='row'
                        >
                            <TextField
                                id="client-secret-field"
                                className='Field'
                                name='clientSecret'
                                control={ control }
                                label='Client Secret'
                                error={ errors.clientSecret}
                                disabled
                            />
                            <Button
                                id="client-secret-generate-btn"
                                variant='text'
                                color='default'
                                onClick={ generateClientSecret }
                            >
                                Generate
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item md={ 2 } />
                    <Grid
                        direction='column'
                        container
                        item
                        md={ 5 }
                        alignItems='flex-start'
                    >
                        <TextField
                            id="access-token-time-field"
                            className='Field'
                            name='accessTokenTimeoutSecs'
                            control={ control }
                            label='Access Token Timeout (Secs)'
                            type='number'
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
                            id="refresh-token-time-field"
                            className='Field'
                            name='refreshTokenTimeoutSecs'
                            control={ control }
                            label='Refresh Token Timeout (Secs)'
                            type='number'
                            error={ errors.refreshTokenTimeoutSecs }
                            rules={ {
                                required: 'Required',
                                validate: {
                                    greaterThanZero
                                }
                            } }
                            transform={ (value: string) => value ? parseInt(value) : '' }
                        />
                        <TextField
                            id="auth-code-time-field"
                            className='Field'
                            name='authCodeTimeoutSecs'
                            control={ control }
                            label='Auth Code Timeout (Secs)'
                            type='number'
                            error={ errors.authCodeTimeoutSecs }
                            rules={ {
                                required: 'Required',
                                validate: {
                                    greaterThanZero
                                }
                            } }
                            transform={ (value: string) => value ? parseInt(value) : '' }
                        />
                    </Grid>
                </Grid>
                <div className="divider" />
                <Grid
                    container
                    direction='row'
                    justify='space-around'
                >
                    <Grid
                        container
                        direction='column'
                        item
                        md={ 5 }
                        alignItems='flex-start'
                    >
                        <Switch
                            id="enabled-field"
                            className='Field shrink'
                            name='enabled'
                            control={ control }
                            label='Enabled'
                        />
                    </Grid>
                    <Grid item md={ 2 } />
                    <Grid
                        direction='column'
                        container
                        item
                        md={ 5 }
                    >
                        <Typography variant="body1">Redirect URIs</Typography>
                        <List
                            id="redirect-uris-list"
                            items={ redirectUriItems }
                            columnLayout
                        />
                        <Button
                            id="add-redirect-uri-btn"
                            className="AddRedirect"
                            color="primary"
                            variant="contained"
                            onClick={ () => showRedirectUriDialog() }
                        >
                            Add Redirect URI
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    className="Actions"
                    container
                    direction="row"
                    justify="space-around"
                >
                    <Button
                        id="save-btn"
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Save
                    </Button>
                    {
                        state.clientId > 0 &&
                        <Button
                            id="delete-btn"
                            variant="contained"
                            color="primary"
                            onClick={ () => toggleDeleteDialog(true) }
                        >
                            Delete
                        </Button>
                    }
                </Grid>
            </form>
            <InputDialog
                open={ state.showRedirectUriDialog }
                title="Redirect URI"
                onCancel={ cancelRedirectUri }
                onSave={ saveRedirectUri }
                label="URI"
                initialValue={ state.selectedRedirectUri }
            />
            <ConfirmDialog
                open={ state.showDeleteDialog }
                title="Delete Client"
                message="Are you sure you want to delete this client?"
                onConfirm={ doDelete }
                onCancel={ () => toggleDeleteDialog(false) }
            />
        </div>
    );
};

export default ClientConfig;
