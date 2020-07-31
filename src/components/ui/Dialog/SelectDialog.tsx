import React, { MouseEvent } from 'react';
import BaseDialog, { DialogAction } from './BaseDialog';
import Autocomplete, { Option } from '../Form/Autocomplete';
import { useForm } from 'react-hook-form';

interface SelectForm {
    value: any;
}

interface Props {
    open: boolean;
    title: string;
    onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
    options: Array<Option>;
}

const SelectDialog = (props: Props) => {
    const {
        open,
        title,
        onSelect,
        onCancel,
        options
    } = props;

    const { control, handleSubmit, errors } = useForm<SelectForm>({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const onSubmit = (values: SelectForm) => {
        console.log(values); // TODO delete this
        // TODO finish this
    };

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
