/*
 *     Auth Management UI
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
    );
};

export default Autocomplete;
