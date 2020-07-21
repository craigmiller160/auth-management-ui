import React, { ReactText } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import MuiTextField from '@material-ui/core/TextField';
import { FieldName, Validate, ValidationRule, ValidationValueMessage } from 'react-hook-form/dist/types/form';

interface Rules {
    required?: string | boolean | ValidationValueMessage<boolean>;
    min?: ValidationRule<ReactText>;
    max?: ValidationRule<ReactText>;
    maxLength?: ValidationRule<ReactText>;
    minLength?: ValidationRule<ReactText>;
    pattern?: ValidationRule<RegExp>;
    validate?: Validate | Record<string,Validate>;
}

interface Props<T> {
    name: keyof T;
    control: Control<T>;
    label: string;
    className?: string;
    error?: FieldError;
    rules?: Rules;
    type?: 'text' | 'number'
    disabled?: boolean;
    transform?: (value: string) => any;
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
        transform
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
