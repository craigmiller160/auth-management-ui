import React, {useEffect} from 'react';
import {match, Prompt, useHistory} from 'react-router';
import {ClientDetails, ClientInput} from '../../../../../types/client';
import {useDispatch} from 'react-redux';
import {useImmer} from 'use-immer';
import {useForm} from 'react-hook-form';
import {Either, getOrElse, map} from 'fp-ts/es6/Either';
import {isRight} from 'fp-ts/es6/These';
import alertSlice from '../../../../../store/alert/slice';
import {createClient, generateGuid, getClientDetails, updateClient} from '../../../../../services/ClientService';
import {pipe} from 'fp-ts/es6/pipeable';
import {Grid} from "@material-ui/core";
import TextField from "../../../../ui/Form/TextField";
import './ClientConfig.scss';
import Button from "@material-ui/core/Button";
import Switch from "../../../../ui/Form/Switch";
import {greaterThanZero} from "../../../../../utils/validations";

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
    const { control, setValue, handleSubmit, errors, reset, getValues, formState: { isDirty } } = useForm<ClientForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultClientForm
    });

    const doSubmit = async (action: () => Promise<Either<Error, ClientDetails>>) => {
        pipe(
            await action(),
            map((client) => {
                setState((draft) => {
                    draft.allowNavigationOverride = true;
                });
                const path = props.match.path.replace(':id', `${client.id}`);
                dispatch(alertSlice.actions.showSuccessAlert(`Successfully saved client ${id}`));
                history.push(path);
            })
        );
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

    useEffect(() => {
        const loadClient = async () => {
            const client = pipe(
                await getClientDetails(state.clientId),
                getOrElse((): ClientDetails => defaultClient)
            );
            reset(client);
        };

        const loadNewClient = async () => {
            const [key, secret] = await Promise.all([generateGuid(), generateGuid()]);
            if (isRight(key) && isRight(secret)) {
                reset({
                    ...defaultClientForm,
                    clientKey: key.right,
                    clientSecret: secret.right
                });
            }
        };

        if (state.clientId > 0) {
            loadClient();
        } else {
            loadNewClient();
        }
    }, [reset, state.clientId]);

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

    // TODO need to add ****** as placeholder value in UI when clientSecret not otherwise visible
    // TODO how to vertically align the items?
    // TODO move enabled switch to bottom of column

    return (
        <div className="ClientConfig">
            <Prompt
                when={ (isDirty || id === NEW) && !state.allowNavigationOverride }
                message="Are you sure you want to leave? Any unsaved changes will be lost."
            />
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                >
                    <Grid
                        container
                        direction="column"
                        item
                        md={ 5 }
                    >
                        <TextField
                            className="Field"
                            name="name"
                            control={ control }
                            label="Client Name"
                            rules={ { required: 'Required' } }
                            error={ errors.name }
                        />
                        <Grid
                            container
                            direction="row"
                        >
                            <TextField
                                className="Field"
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
                        >
                            <TextField
                                className="Field"
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
                    <Grid item md={ 2 } />
                    <Grid
                        direction="column"
                        container
                        item
                        md={ 5 }
                    >
                        <Switch
                            className="Field"
                            name="enabled"
                            control={ control }
                            label="Enabled"
                        />
                        <TextField
                            className="Field"
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
                            className="Field"
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
                </Grid>
            </form>
        </div>
    );
};

export default ClientConfig;
