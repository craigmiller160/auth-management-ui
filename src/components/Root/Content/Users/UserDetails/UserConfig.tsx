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
import { UserDetails, UserInput } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { createUser, deleteUser, getUserDetails, updateUser } from '../../../../../services/UserService';
import { pipe } from 'fp-ts/es6/pipeable';
import { Either, getOrElse, map } from 'fp-ts/es6/Either';
import { useForm } from 'react-hook-form';
import { isRight } from 'fp-ts/es6/These';
import alertSlice from '../../../../../store/alert/slice';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import TextField from '../../../../ui/Form/TextField';
import { email } from '../../../../../utils/validations';
import './UserConfig.scss';
import Switch from '../../../../ui/Form/Switch';
import Button from '@material-ui/core/Button';
import { ConfirmDialog } from '../../../../ui/Dialog';
import { IdMatchProps, NEW_ID } from '../../../../../types/detailsPage';

interface State {
    allowNavigationOverride: boolean;
    showDeleteDialog: boolean;
    userId: number;
}

interface Props extends IdMatchProps {}

interface UserForm extends UserInput {
    confirmPassword: string;
}

const defaultUser: UserDetails = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    enabled: true
};

const defaultForm: UserForm = {
    ...defaultUser,
    password: '',
    confirmPassword: ''
};

const UserConfig = (props: Props) => {
    const id = props.match.params.id;
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useImmer<State>({
        allowNavigationOverride: false,
        showDeleteDialog: false,
        userId: id !== NEW_ID ? parseInt(id) : 0
    });
    const { control, handleSubmit, errors, reset, getValues, watch, formState: { isDirty } } = useForm<UserForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultForm
    });
    const watchPassword = watch('password', '');

    const doSubmit = async (action: () => Promise<Either<Error, UserDetails>>) => {
        pipe(
            await action(),
            map((user) => {
                setState((draft) => {
                    draft.userId = user.id;
                });
                reset(user);
                const path = props.match.path.replace(':id', `${user.id}`);
                dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved user ${id}`));
                history.push(path);
            })
        );
    };

    const onSubmit = (values: UserForm) => {
        const payload: UserInput = {
            ...values
        };
        if (state.userId === 0) {
            doSubmit(() => createUser(payload));
        } else {
            doSubmit(() => updateUser(parseInt(id), payload));
        }
    };

    useEffect(() => {
        const action = async () => {
            const user = pipe(
                await getUserDetails(state.userId),
                getOrElse((): UserDetails => defaultUser)
            );
            reset(user);
        };

        if (state.userId > 0) {
            action();
        } else {
            reset(defaultUser);
        }
    }, [state.userId, reset]);

    const confirmPasswordValidator = (value: string) => {
        const password = getValues().password;
        if (!password) {
            return true;
        }
        if (!value) {
            return 'Required';
        }
        return password === value || 'Passwords must match';
    };

    const passwordRules = state.userId === 0 ? { required: 'Required' } : {};

    const toggleDeleteDialog = (show: boolean) =>
        setState((draft) => {
            draft.showDeleteDialog = show;
        });

    const doDelete = async () => {
        const result = await deleteUser(parseInt(id));
        if (isRight(result)) {
            setState((draft) => {
                draft.allowNavigationOverride = true;
            });
            history.push('/users');
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully deleted user ${id}`));
        }
    };

    return (
        <div className="UserConfig">
            <Prompt
                when={ (isDirty || state.userId === 0) && !state.allowNavigationOverride }
                message="Are you sure you want to leave? Any unsaved changes will be lost."
            />
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                >
                    <Grid
                        direction="column"
                        container
                        item
                        md={ 5 }
                    >
                        <TextField
                            className="Field"
                            name="email"
                            control={ control }
                            label="Email"
                            error={ errors.email }
                            rules={ {
                                required: 'Required',
                                validate: {
                                    email
                                }
                            } }
                        />
                        <TextField
                            className="Field"
                            name="firstName"
                            control={ control }
                            label="First Name"
                            error={ errors.firstName }
                            rules={ {
                                required: 'Required'
                            } }
                        />
                        <TextField
                            className="Field"
                            name="lastName"
                            control={ control }
                            label="Last Name"
                            error={ errors.lastName }
                            rules={ {
                                required: 'Required'
                            } }
                        />
                    </Grid>
                    <Grid item md={ 2 } />
                    <Grid
                        direction="column"
                        container
                        item
                        md={ 5 }
                    >
                        <TextField
                            className="Field"
                            name="password"
                            control={ control }
                            label="Password"
                            error={ errors.password }
                            rules={ passwordRules }
                        />
                        <TextField
                            className="Field"
                            name="confirmPassword"
                            type="password"
                            control={ control }
                            label="Password (Confirm)"
                            error={ errors.confirmPassword }
                            rules={ {
                                validate: {
                                    confirmPasswordValidator
                                }
                            } }
                            disabled={ !watchPassword }
                        />
                        <Switch
                            className="Field"
                            name="enabled"
                            control={ control }
                            label="Enabled"
                        />
                    </Grid>
                </Grid>
                <Grid
                    className="Actions"
                    container
                    direction="row"
                    justify="space-around"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Save
                    </Button>
                    {
                        state.userId > 0 &&
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
                title="Delete User"
                message="Are you sure you want to delete this user?"
                onConfirm={ doDelete }
                onCancel={ () => toggleDeleteDialog(false) }
            />
        </div>
    );
};

export default UserConfig;
