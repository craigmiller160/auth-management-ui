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
import { Control, Controller } from 'react-hook-form';
import { FieldName } from 'react-hook-form/dist/types/form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';

interface Props<T> {
  id?: string;
  name: keyof T;
  control: Control<T>;
  label: string;
  color?: 'primary' | 'secondary' | 'default';
}

const Checkbox = <T extends object>(props: Props<T>) => {
  const { id, name, control, color, label } = props;

  return (
    <Controller
      control={control}
      name={name as FieldName<T>}
      render={({ onChange, onBlur, value }) => (
        <FormControlLabel
          label={label}
          control={
            <MuiCheckbox
              id={id}
              onChange={(event) => onChange(event.target.checked)}
              onBlur={onBlur}
              checked={value}
              color={color ?? 'primary'}
            />
          }
        />
      )}
    />
  );
};

export default Checkbox;
