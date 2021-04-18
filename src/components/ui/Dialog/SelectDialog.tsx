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

import React, { MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import {
	BaseDialog,
	DialogAction
} from '@craigmiller160/react-material-ui-common';
import Autocomplete, { SelectOption } from '../Form/Autocomplete';
import './SelectDialog.scss';

interface SelectForm<T> {
	value: SelectOption<T> | null;
}

interface Props<T> {
	id?: string;
	label: string;
	open: boolean;
	title: string;
	onSelect: (value: SelectOption<T>) => void;
	onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
	options: Array<SelectOption<T>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultForm: SelectForm<any> = {
	value: null
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectDialog = <T extends any>(props: Props<T>): JSX.Element => {
	const { id, open, title, onSelect, onCancel, options, label } = props;

	const { control, handleSubmit, errors, reset } = useForm<SelectForm<T>>({
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: defaultForm
	});

	const onSubmit = (values: SelectForm<T>) => {
		reset(defaultForm);
		if (values.value != null) {
			onSelect(values.value);
		}
	};

	const actions: Array<DialogAction> = [
		{ label: 'Select', onClick: handleSubmit(onSubmit) },
		{ label: 'Cancel', onClick: onCancel }
	];

	return (
		<BaseDialog
			id={id}
			open={open}
			title={title}
			actions={actions}
			className="SelectDialog"
		>
			<Autocomplete
				className="Field"
				name="value"
				control={control}
				label={label}
				options={options}
				rules={{ required: 'Required' }}
				error={errors.value}
			/>
		</BaseDialog>
	);
};

export default SelectDialog;
