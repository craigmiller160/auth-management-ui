import React from 'react';
import { Prompt, match, useHistory } from 'react-router';
import { ClientDetails, ClientInput } from '../../../../../types/client';
import { useDispatch } from 'react-redux';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import { Either } from 'fp-ts/es6/Either';
import { UserDetails, UserInput } from '../../../../../types/user';
import { isRight } from 'fp-ts/es6/These';
import alertSlice from '../../../../../store/alert/slice';
import { createUser, updateUser } from '../../../../../services/UserService';
import { createClient, updateClient } from '../../../../../services/ClientService';

interface State {
    allowNavigationOverride: boolean;
    showDeleteDialog: boolean;
    clientId: number;
}
const NEW = 'new';
interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

const defaultClient: ClientDetails = {
    id: 0,
    name: '',
    clientKey: '',
    enabled: false,
    refreshTokenTimeoutSecs: 0,
    accessTokenTimeoutSecs: 0
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
        clientId: id !== NEW ? parseInt(id) : 0
    });
    const { control, handleSubmit, errors, reset, getValues, formState: { isDirty } } = useForm<ClientForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultClientForm
    });

    const doSubmit = async (action: () => Promise<Either<Error, ClientDetails>>) => {
        const result = await action();
        if (isRight(result)) {
            dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved user ${id}`));
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

    return (
        <div className="ClientConfig">
            <Prompt
                when={ false }
                message="Are you sure you want to leave? Any unsaved changes will be lost."
            />
            <form>

            </form>
        </div>
    );
};

export default ClientConfig;
