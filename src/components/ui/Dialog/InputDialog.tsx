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
    transform?: (value: string) => any;
    prefix?: string;
}

const InputDialog = (props: Props) => {
    const {
        open,
        title,
        onCancel,
        onSave,
        label,
        initialValue = '',
        transform,
        prefix
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

    const prefixClasses = ['prefix'];
    if (errors.value) {
        prefixClasses.push('error');
    }

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
            className="InputDialog"
        >
            <div className="InputDialogContent">
                {
                    prefix &&
                    <span className={ prefixClasses.join(' ') }>{ prefix }</span>
                }
                <TextField
                    className="Field"
                    name="value"
                    control={ control }
                    label={ label }
                    error={ errors.value }
                    rules={ { required: 'Required' } }
                    transform={ transform }
                />
            </div>
        </BaseDialog>
    );
};

export default InputDialog;