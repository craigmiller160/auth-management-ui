import React from 'react';
import BaseDialog from '../../../../ui/Dialog/BaseDialog';
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

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ [] }
        >
            <TextField

            />
        </BaseDialog>
    );
};

export default RoleDialog;
