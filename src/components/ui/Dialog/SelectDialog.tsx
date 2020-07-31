import React, { MouseEvent } from 'react';
import BaseDialog, { DialogAction } from './BaseDialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

interface Option {
    label: string;
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

    const actions: Array<DialogAction> = [
        { label: 'Select', onClick: onSelect },
        { label: 'Cancel', onClick: onCancel }
    ];

    return (
        <BaseDialog
            open={ open }
            title={ title }
            actions={ actions }
        >
            <Autocomplete
                options={ options }
                getOptionLabel={ (option) => option?.label ?? '' }
                renderInput={ (params) => (
                    <TextField
                        { ...params }
                        label="Select User"
                        variant="outlined"
                    />
                ) }
            />
        </BaseDialog>
    );
};

export default SelectDialog;
