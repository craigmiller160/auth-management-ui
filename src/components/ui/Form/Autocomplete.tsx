import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { FieldRules } from '../../../types/form';
import { FieldName } from 'react-hook-form/dist/types/form';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

export interface SelectOption<R> {
    label: string;
    value: R;
}

interface Props<T,R> {
    name: keyof T;
    control: Control<T>;
    error?: FieldError;
    rules?: FieldRules;
    label: string;
    options: Array<SelectOption<R>>;
    className?: string;
}

const Autocomplete = <T extends object, R extends any>(props: Props<T,R>) => {
    const {
        name,
        control,
        error,
        rules,
        label,
        options,
        className
    } = props;

    return (
        <Controller
            control={ control }
            name={ name as FieldName<T> }
            rules={ rules }
            render={ ({ onChange, onBlur, value }) => (
                <MuiAutocomplete
                    className={ className }
                    options={ options }
                    getOptionLabel={ (option) => option?.label ?? '' }
                    value={ value }
                    onChange={ (event, newValue) => onChange(newValue)}
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
