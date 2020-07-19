import React, { useEffect } from 'react';
import { Prompt, useHistory, useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { User } from '../../../../../types/api';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createChangeHandler, HandledChangeEvent } from '../../../../../utils/changeHandlers';
import { assignProperty } from '../../../../../utils/propertyTypes';
import './UserDetails.scss';
import { PageHeader, SectionHeader } from '../../../../ui/Header';
import { isSome, Option } from 'fp-ts/es6/Option';
import alertSlice from '../../../../../store/alert/slice';
import { createUser, deleteUser, getUser, updateUser } from '../../../../../services/UserService';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ConfirmDialog } from '../../../../ui/Dialog';

interface State {
    user: Partial<User>;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
    confirmPassword: string;
}

interface MatchParams {
    id: string;
}

interface UserForm extends Omit<User, 'id'> {
    confirmPassword: string;
}
const NEW = 'new';

const defaultUser: User = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    password: ''
};

const UserDetails = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch<MatchParams>();
    const id = match.params.id;
    const [state, setState] = useImmer<State>({
        user: {},
        shouldBlockNavigation: true,
        showDeleteDialog: false,
        confirmPassword: ''
    });
    const { register, handleSubmit, errors } = useForm<UserForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const doSubmit = async (action: () => Promise<Option<any>>) => {
        const result = await action();
        if (isSome(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/users');
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved user ${result.value.id}`));
        }
    };

    const onSubmit = () => {
        const payload: User = {
            ...defaultUser,
            ...state.user
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
                setState((draft) => {
                    draft.user = defaultUser;
                });
            } else {
                const result = await getUser(parseInt(id));
                if (isSome(result)) {
                    setState((draft) => {
                        draft.user = result.value;
                    });
                } else {
                    setState((draft) => {
                        draft.user = {};
                    });
                }
            }
        };

        action();
    }, [id, setState]);

    const inputChange = (event: HandledChangeEvent) => {
        setState((draft) => {
            if (event.name === 'confirmPassword') {
                assignProperty(draft, event.name, event.value);
            } else {
                assignProperty(draft.user, event.name, event.value);
            }
        });
    };
    const changeHandler = createChangeHandler(inputChange);

    const doCancel = () => history.push('/users');

    const toggleDeleteDialog = (show: boolean) => setState((draft) => {
        draft.showDeleteDialog = show;
    });

    const doDelete = async () => {
        const result = await deleteUser(parseInt(id));
        if (isSome(result)) {
            setState((draft) => {
                draft.shouldBlockNavigation = false;
            });
            history.push('/users');
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully deleted user ${id}`));
        }
    };

    const confirmPasswordValidator = (value: string) => {
        if (!value && state.user.password) {
            return 'Required';
        }
        return state.user.password === value || 'Passwords must match';
    };

    const passwordRules = id === NEW ? { required: 'Required' } : {};

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
                            className="grow-sm"
                            label="Email"
                            name="email"
                            value={ state.user.email ?? '' }
                            onChange={ changeHandler.handleTextField }
                            inputRef={ register({ required: 'Required' }) }
                            error={ !!errors.email }
                            helperText={ errors.email?.message ?? '' }
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
                            type="password"
                            label="Password"
                            name="password"
                            value={ state.user.password ?? '' }
                            onChange={ changeHandler.handleTextField }
                            inputRef={ register(passwordRules) }
                            error={ !!errors.password }
                            helperText={ errors.password?.message ?? '' }
                        />
                        <TextField
                            className="grow-sm"
                            type="password"
                            label="Password (Confirm)"
                            name="confirmPassword"
                            value={ state.confirmPassword ?? '' }
                            onChange={ changeHandler.handleTextField }
                            inputRef={ register({
                                validate: {
                                    confirmPasswordValidator
                                }
                            }) }
                            error={ !!errors.confirmPassword }
                            helperText={ errors.confirmPassword?.message ?? '' }
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
                            label="First Name"
                            name="firstName"
                            value={ state.user.firstName ?? '' }
                            onChange={ changeHandler.handleTextField }
                            inputRef={ register({ required: 'Required' }) }
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message ?? '' }
                        />
                        <TextField
                            className="grow-sm"
                            label="Last Name"
                            name="lastName"
                            value={ state.user.lastName ?? '' }
                            onChange={ changeHandler.handleTextField }
                            inputRef={ register({ required: 'Required' }) }
                            error={ !!errors.lastName }
                            helperText={ errors.lastName?.message ?? '' }
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
                    message="Are you sure you want to delete this user?"
                    onConfirm={ doDelete }
                    onCancel={ () => toggleDeleteDialog(false) }
                />
            </div>
        </>
    );
};

export default UserDetails;
