import React, { ChangeEvent } from 'react';
import BaseDialog, { DialogAction } from '../../../../ui/Dialog/BaseDialog';
import TextField from '@material-ui/core/TextField';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';

interface Props {
    open: boolean;
    title: string;
}

interface RoleForm {
    name: string;
}

const RoleDialog = (props: Props) => {
    const {
        open,
        title
    } = props;
    const [state, setState] = useImmer<RoleForm>({
        name: ''
    });
    const { register, handleSubmit, errors } = useForm<RoleForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const onSubmit = (arg: any) => console.log(arg); // TODO delete this

    const actions: Array<DialogAction> = [
        { label: 'Save', onClick: handleSubmit(onSubmit) }
    ];

    const setName = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState((draft) => {
            draft.name = value;
        });
    };

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
        >
            <TextField
                name="name"
                label="Role Name"
                value={ state.name }
                onChange={ setName }
                inputRef={ register({ required: 'Required' }) }
                error={ !!errors.name }
                helperText={ errors.name?.message ?? '' }
            />
        </BaseDialog>
    );
};

export default RoleDialog;
