import React, { useEffect } from 'react';
import { match, Prompt, useHistory } from 'react-router';
import { UserDetails, UserInput } from '../../../../../types/user';
import { useImmer } from 'use-immer';
import { createUser, getUserDetails, updateUser } from '../../../../../services/UserService';
import { pipe } from 'fp-ts/es6/pipeable';
import { Either, getOrElse } from 'fp-ts/es6/Either';
import { useForm } from 'react-hook-form';
import { isRight } from 'fp-ts/es6/These';
import alertSlice from '../../../../../store/alert/slice';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import TextField from '../../../../ui/Form/TextField';
import { email } from '../../../../../utils/validations';

interface State {
    shouldBlockNavigation: boolean;
    userId: number;
    user: UserDetails;
}
const NEW = 'new';
interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

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
        shouldBlockNavigation: true,
        userId: id !== NEW ? parseInt(id) : 0,
        user: defaultUser
    });
    const { control, handleSubmit, errors, reset, getValues, watch, setValue, trigger } = useForm<UserForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultForm
    });
    const watchPassword = watch('password', ''); // TODO what is this used for?

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
            const user = pipe(
                await getUserDetails(state.userId),
                getOrElse((): UserDetails => defaultUser)
            );
            setState((draft) => {
                draft.user = user;
            });
        };

        if (state.userId > 0) {
            action();
        }
    }, [state.userId, setState]);

    return (
        <div>
            <Prompt
                when={ state.shouldBlockNavigation }
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
                            name="firstName"
                            control={ control }
                            label="First Name"
                            error={ errors.firstName }
                            rules={ {
                                required: 'Required'
                            } }
                        />
                        <TextField
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
                        <p>Hello</p>
                        <p>Universe</p>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default UserConfig;
