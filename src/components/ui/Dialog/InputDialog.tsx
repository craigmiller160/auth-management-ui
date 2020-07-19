import React from 'react';
import BaseDialog from './BaseDialog';
import TextField from '@material-ui/core/TextField';
import { useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';

interface Props {
    open: boolean;
    title: string;
}

interface InputForm {
    value: string;
}

const InputDialog = (props: Props) => {
    const {
        open,
        title
    } = props;
    const [state, setState] = useImmer<InputForm>({
        value: ''
    });
    const { register, handleSubmit, errors } = useForm<InputForm>({
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

export default InputDialog;
