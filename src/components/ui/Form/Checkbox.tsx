import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FieldName } from 'react-hook-form/dist/types/form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';

interface Props<T> {
    name: keyof T;
    control: Control<T>;
    label: string;
    color?: 'primary' | 'secondary' | 'default';
}

const Checkbox = <T extends object>(props: Props<T>) => {
    const {
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
                    label={ label }
                    control={
                        <MuiCheckbox
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

export default Checkbox;
