import React, { useEffect } from 'react';
import { Prompt, useHistory, useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import './UserDetails.scss';
import { PageHeader, SectionHeader } from '../../../../ui/Header';
import alertSlice from '../../../../../store/alert/slice';
import { createUser, deleteUser, getUser, updateUser } from '../../../../../services/UserService';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ConfirmDialog } from '../../../../ui/Dialog';
import TextField from '../../../../ui/Form/TextField';
import { FullUserDetails, UserClient, UserDetails, UserInput } from '../../../../../types/user';
import { Either, getOrElse } from 'fp-ts/es6/Either';
import { isRight } from 'fp-ts/es6/These';
import { pipe } from 'fp-ts/es6/pipeable';
import { email } from '../../../../../utils/validations';
import { none, Option, some } from 'fp-ts/es6/Option';
import UserClients from './UserClients';
import UserRoles from './UserRoles';

interface State {
    userId: number;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
    clients: Array<UserClient>;
    selectedClient: Option<UserClient>;
}

interface MatchParams {
    id: string;
}

interface UserForm extends UserInput {
    confirmPassword: string;
}
const NEW = 'new';

const defaultUser: UserDetails = {
    id: 0,
    email: '',
    firstName: '',
    lastName: ''
};

const defaultFullUser: FullUserDetails = {
    ...defaultUser,
    clients: []
};

const defaultForm: UserForm = {
    ...defaultUser,
    password: '',
    confirmPassword: ''
};

const UserDetailsComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        userId: id !== NEW ? parseInt(id) : 0,
        shouldBlockNavigation: true,
        showDeleteDialog: false,
        clients: [],
        selectedClient: none
    });
    const { control, handleSubmit, errors, reset, getValues, watch, setValue, trigger } = useForm<UserForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultForm
    });
    const watchPassword = watch('password', '');

    const updateClients = (clients: Array<UserClient>) => {
        setState((draft) => {
            draft.clients = clients;
            draft.selectedClient = none;
        });
    };

    const doSubmit = async (action: () => Promise<Either<Error, UserDetails>>) => {
        const result = await action();
        if (isRight(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/users');
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved user ${id}`));
        }
    };

    const onSubmit = (values: UserForm) => {
        const payload: UserInput = {
            ...values
        };
        if (id === NEW) {
            doSubmit(() => createUser(payload));
        } else {
            doSubmit(() => updateUser(parseInt(id), payload));
        }
    };

    useEffect(() => {
        const action = async () => {
            if (id === NEW) {
                reset(defaultUser);
            } else {
                const user = pipe(
                    await getUser(parseInt(id)),
                    getOrElse(() => defaultFullUser)
                );
                reset(user);
                setState((draft) => {
                    draft.clients = user.clients
                });
            }
        };

        action();
    }, [id, reset, setState]);

    useEffect(() => {
        if (watchPassword === '') {
            setValue('confirmPassword', '');
            trigger('confirmPassword');
        }
    }, [watchPassword, setValue, trigger]);

    const doCancel = () => history.push('/users');

    const toggleDeleteDialog = (show: boolean) => setState((draft) => {
        draft.showDeleteDialog = show;
    });

    const doDelete = async () => {
        const result = await deleteUser(parseInt(id));
        if (isRight(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/users');
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully deleted user ${id}`));
        }
    };

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

    const passwordRules = id === NEW ? { required: 'Required' } : {};

    const selectClient = (client: UserClient) =>
        setState((draft) => {
            draft.selectedClient = some(client)
        });


    return (
        <>
            <Prompt
                when={ state.shouldBlockNavigation }
                message="Are you sure you want to leave? Any unsaved changes will be lost."
            />
            <div className="UserDetails">
                <PageHeader title="User Details" />
                <form onSubmit={ handleSubmit(onSubmit) }>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                    >
                        <TextField
                            name="email"
                            control={ control }
                            label="Email"
                            className="grow-sm"
                            rules={ {
                                required: 'Required',
                                validate: {
                                    email
                                }
                            } }
                            error={ errors.email }
                        />
                    </Grid>
                    <SectionHeader title="Password" />
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                    >
                        <TextField
                            className="grow-sm"
                            name="password"
                            type="password"
                            control={ control }
                            label="Password"
                            error={ errors.password }
                            rules={ passwordRules }
                        />
                        <TextField
                            className="grow-sm"
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
                    </Grid>
                    <SectionHeader title="Personal" />
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                    >
                        <TextField
                            className="grow-sm"
                            name="firstName"
                            control={ control }
                            label="First Name"
                            error={ errors.firstName }
                            rules={ { required: 'Required' } }
                        />
                        <TextField
                            className="grow-sm"
                            name="lastName"
                            control={ control }
                            label="Last Name"
                            error={ errors.lastName }
                            rules={ { required: 'Required' } }
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
                    <Grid
                        container
                        direction="row"
                    >
                        <Grid item md={ 5 }>
                            <UserClients
                                userClients={ state.clients }
                                userId={ parseInt(id) }
                                updateClients={ updateClients }
                                selectedClient={ state.selectedClient }
                                selectClient={ selectClient }
                            />
                        </Grid>
                        <Grid item md={ 2 } />
                        <Grid item md={ 5 }>
                            <UserRoles
                                selectedClient={ state.selectedClient }
                            />
                        </Grid>
                    </Grid>
                }
                <ConfirmDialog
                    open={ state.showDeleteDialog }
                    title="Delete Client"
                    message="Are you sure you want to delete this user?"
                    onConfirm={ doDelete }
                    onCancel={ () => toggleDeleteDialog(false) }
                />
            </div>
        </>
    );
};

export default UserDetailsComponent;
