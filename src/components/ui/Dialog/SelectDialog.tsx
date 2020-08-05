import React, { MouseEvent } from 'react';
import BaseDialog, { DialogAction } from './BaseDialog';
import Autocomplete, { SelectOption } from '../Form/Autocomplete';
import { useForm } from 'react-hook-form';

interface SelectForm<T> {
    value: SelectOption<T> | null;
}

interface Props<T> {
    open: boolean;
    title: string;
    onSelect: (value: SelectOption<T>) => void;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
    options: Array<SelectOption<T>>;
}

const defaultForm: SelectForm<any> = {
    value: null
}

const SelectDialog = <T extends any>(props: Props<T>) => {
    const {
        open,
        title,
        onSelect,
        onCancel,
        options
    } = props;

    const { control, handleSubmit, errors, reset } = useForm<SelectForm<T>>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: defaultForm
    });

    const onSubmit = (values: SelectForm<T>) => {
        reset(defaultForm);
        if (values.value != null) {
            onSelect(values.value);
        }
    }

    const actions: Array<DialogAction> = [
        { label: 'Select', onClick: handleSubmit(onSubmit) },
        { label: 'Cancel', onClick: onCancel }
    ];

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
        >
            <Autocomplete
                name="value"
                control={ control }
                label="Select User"
                options={ options }
                rules={ { required: 'Required' } }
                error={ errors.value }
            />
        </BaseDialog>
    );
};

export default SelectDialog;
