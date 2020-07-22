import React, { useEffect } from 'react';
import { Prompt, useHistory, useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { User } from '../../../../../types/api';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import './UserDetails.scss';
import { PageHeader, SectionHeader } from '../../../../ui/Header';
import { isSome, Option } from 'fp-ts/es6/Option';
import alertSlice from '../../../../../store/alert/slice';
import { createUser, deleteUser, getUser, updateUser } from '../../../../../services/UserService';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ConfirmDialog } from '../../../../ui/Dialog';
import TextField from '../../../../ui/Form/TextField';

interface State {
    userId: number;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
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
        userId: id !== NEW ? parseInt(id) : 0,
        shouldBlockNavigation: true,
        showDeleteDialog: false
    });
    const { control, handleSubmit, errors, reset, getValues } = useForm<UserForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultUser
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

    const onSubmit = (values: UserForm) => {
        const payload: User = {
            ...values,
            id: state.userId
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
                const result = await getUser(parseInt(id));
                if (isSome(result)) {
                    reset(result.value);
                } else {
                    reset({});
                }
            }
        };

        action();
    }, [id, reset]);

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

    // TODO add rule to require confirmPassword for password
    // TODO only allow edits to confirmPassword if password is present

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
                            rules={ { required: 'Required' } }
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
                            control={ control }
                            label="Password (Confirm)"
                            error={ errors.confirmPassword }
                            rules={ {
                                validate: {
                                    confirmPasswordValidator
                                }
                            } }
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
