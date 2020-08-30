import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FieldName } from 'react-hook-form/dist/types/form';
import MuiSwitch from '@material-ui/core/Switch';
import { FormControlLabel } from '@material-ui/core';

interface Props<T> {
    name: keyof T;
    control: Control<T>;
    label: string;
    color?: 'primary' | 'secondary' | 'default';
    className?: string;
}

const Switch = <T extends object>(props: Props<T>) => {
    const {
        className,
        name,
        control,
        color,
        label
    } = props;

    return (
        <Controller
            control={ control }
            name={ name as FieldName<T> }
            render={ ({ onChange, onBlur, value }) => (
                <FormControlLabel
                    className={ className }
                    label={ label }
                    control={
                        <MuiSwitch
                            onChange={ (event) => onChange(event.target.checked) }
                            onBlur={ onBlur }
                            checked={ value }
                            color={ color ?? 'primary' }
                        />
                    }
                />
            ) }
        />
    );
};

export default Switch;
