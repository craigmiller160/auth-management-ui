import React, { MouseEvent, useEffect } from 'react';
import BaseDialog, { DialogAction } from './BaseDialog';
import { useForm } from 'react-hook-form';
import TextField from '../Form/TextField';
import './InputDialog.scss';

interface InputForm {
    value: string;
}

interface Props {
    open: boolean;
    title: string;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
    onSave: (value: string) => void;
    label: string;
    initialValue?: string;
}

const InputDialog = (props: Props) => {
    const {
        open,
        title,
        onCancel,
        onSave,
        label,
        initialValue = ''
    } = props;

    const { control, handleSubmit, errors, reset } = useForm<InputForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            value: initialValue
        }
    });

    useEffect(() => {
        reset({
            value: initialValue
        });
    }, [open, initialValue]);

    const onSubmit = (values: InputForm) => {
        if (values.value) {
            onSave(values.value);
        }
    };

    const actions: Array<DialogAction> = [
        { label: 'Save', onClick: handleSubmit(onSubmit) },
        { label: 'Cancel', onClick: onCancel }
    ];

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
            className="InputDialog"
        >
            <TextField
                className="Field"
                name="value"
                control={ control }
                label={ label }
                error={ errors.value }
                rules={ { required: 'Required' } }
            />
        </BaseDialog>
    );
};

export default InputDialog;