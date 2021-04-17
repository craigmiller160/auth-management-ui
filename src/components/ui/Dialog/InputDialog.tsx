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

import React, { MouseEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  BaseDialog,
  DialogAction,
} from '@craigmiller160/react-material-ui-common';
import TextField from '../Form/TextField';
import './InputDialog.scss';

interface InputForm {
  value: string;
}

interface Props {
  id?: string;
  open: boolean;
  title: string;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  onSave: (value: string) => void;
  label: string;
  initialValue?: string;
  transform?: (value: string) => any;
  prefix?: string;
  successBtnLabel?: string;
}

const InputDialog = (props: Props) => {
  const {
    id,
    open,
    title,
    onCancel,
    onSave,
    label,
    initialValue = '',
    transform,
    prefix,
    successBtnLabel,
  } = props;

  const { control, handleSubmit, errors, reset } = useForm<InputForm>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      value: initialValue,
    },
  });

  useEffect(() => {
    reset({
      value: initialValue,
    });
  }, [ open, initialValue, reset ]);

  const onSubmit = (values: InputForm) => {
    if (values.value) {
      onSave(values.value);
    }
  };

  const actions: Array<DialogAction> = [
    { label: successBtnLabel ?? 'Save', onClick: handleSubmit(onSubmit) },
    { label: 'Cancel', onClick: onCancel },
  ];

  const prefixClasses = [ 'prefix' ];
  if (errors.value) {
    prefixClasses.push('error');
  }

  const actualId = id ?? 'input-dialog';

  return (
    <BaseDialog
      id={actualId}
      open={open}
      title={title}
      actions={actions}
      className="InputDialog"
    >
      <div className="InputDialogContent">
        {prefix && <span className={prefixClasses.join(' ')}>{prefix}</span>}
        <TextField
          id={`${actualId}-input`}
          className="Field"
          name="value"
          control={control}
          label={label}
          error={errors.value}
          rules={{ required: 'Required' }}
          transform={transform}
        />
      </div>
    </BaseDialog>
  );
};

export default InputDialog;
