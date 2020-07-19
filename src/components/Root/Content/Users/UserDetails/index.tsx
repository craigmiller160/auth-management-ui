import React, { useEffect } from 'react';
import { Prompt, useHistory, useRouteMatch } from 'react-router';
import { useImmer } from 'use-immer';
import { Client, User } from '../../../../../types/api';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createChangeHandler, HandledChangeEvent } from '../../../../../utils/changeHandlers';
import { assignProperty } from '../../../../../utils/propertyTypes';
import './UserDetails.scss';
import { PageHeader } from '../../../../ui/Header';
import { createClient, deleteClient, updateClient } from '../../../../../services/ClientService';
import { isSome, Option } from 'fp-ts/es6/Option';
import alertSlice from '../../../../../store/alert/slice';
import { createUser, deleteUser, getUser, updateUser } from '../../../../../services/UserService';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

interface State {
    user: Partial<User>;
    shouldBlockNavigation: boolean;
    showDeleteDialog: boolean;
}

interface MatchParams {
    id: string;
}

interface UserForm extends Omit<User, 'id'> { }
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
        showDeleteDialog: false
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
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved client ${result.value.id}`));
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
            assignProperty(draft.user, event.name, event.value);
        });
    };
    const changeHandler = createChangeHandler(inputChange);

    const doCancel = () => history.push('/clients');

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
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully deleted client ${id}`));
        }
    };

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
                </form>
            </div>
        </>
    );
};

export default UserDetails;
