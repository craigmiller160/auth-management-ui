import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { FieldRules } from '../../../types/form';
import { FieldName } from 'react-hook-form/dist/types/form';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

export interface Option {
    label: string;
    value: any;
}

interface Props<T> {
    name: keyof T;
    control: Control<T>;
    error?: FieldError;
    rules?: FieldRules;
    label: string;
    options: Array<Option>;
}

const Autocomplete = <T extends object>(props: Props<T>) => {
    const {
        name,
        control,
        error,
        rules,
        label,
        options
    } = props;

    return (
        <Controller
            control={ control }
            name={ name as FieldName<T> }
            rules={ rules }
            render={ ({ onChange, onBlur, value }) => (
                <MuiAutocomplete
                    options={ options }
                    getOptionLabel={ (option) => option?.label ?? '' }
                    value={ value }
                    onChange={ onChange }
                    onBlur={ onBlur }
                    renderInput={ (params) => (
                        <TextField
                            { ...params }
                            label={ label }
                            variant="outlined"
                            error={ !!error }
                            helperText={ error?.message ?? '' }
                        />
                    ) }
                />
            ) }
        />
    )
};

export default Autocomplete;
