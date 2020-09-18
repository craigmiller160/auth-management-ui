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
import MuiTextField from '@material-ui/core/TextField';
import { FieldName } from 'react-hook-form/dist/types/form';
import { FieldRules } from '../../../types/form';


interface Props<T> {
    name: keyof T;
    control: Control<T>;
    label: string;
    className?: string;
    error?: FieldError;
    rules?: FieldRules;
    type?: 'text' | 'number' | 'password';
    disabled?: boolean;
    transform?: (value: string) => any;
    placeholder?: string;
}

const TextField = <T extends object>(props: Props<T>) => {
    const {
        name,
        control,
        className,
        label,
        error,
        rules,
        type,
        disabled,
        transform,
        placeholder
    } = props;

    return (
        <Controller
            control={ control }
            name={ name as FieldName<T> }
            rules={ rules }
            render={ ({ onChange, onBlur, value }) => (
                <MuiTextField
                    type={ type }
                    className={ className }
                    label={ label }
                    placeholder={ placeholder }
                    onChange={ (event) => {
                        if (transform) {
                            onChange(transform(event.target.value));
                        } else {
                            onChange(event.target.value);
                        }
                    } }
                    onBlur={ onBlur }
                    value={ value }
                    error={ !!error }
                    helperText={ error?.message ?? '' }
                    disabled={ disabled }
                />
            ) }
        />
    );
};

export default TextField;
