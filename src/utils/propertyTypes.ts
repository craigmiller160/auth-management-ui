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

// TODO make separate library
/* eslint-disable */

type AnyPropName = {
	[name: string]: any;
};

export type AnyPropString = {
	[name: string]: string;
};

export type AnyPropNumber = {
	[name: string]: number;
};

export type AnyPropBoolean = {
	[name: string]: boolean;
};

export class PropertyTypeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PropertyTypeError';
	}
}

export const objectHasProperty = (
	obj: object,
	name: string
): obj is AnyPropName => Object.prototype.hasOwnProperty.call(obj, name);

export const isStringProperty = (
	obj: object,
	name: string
): obj is AnyPropString => {
	if (objectHasProperty(obj, name)) {
		return typeof obj[name] === 'string';
	}
	return false;
};

export const assignStringProperty = (
	obj: object,
	name: string,
	value: string
): boolean => {
	if (isStringProperty(obj, name)) {
		obj[name] = value; // eslint-disable-line no-param-reassign
		return true;
	}
	return false;
};

export const isNumberProperty = (
	obj: object,
	name: string
): obj is AnyPropNumber => {
	if (objectHasProperty(obj, name)) {
		return typeof obj[name] === 'number';
	}
	return false;
};

export const assignNumberProperty = (
	obj: object,
	name: string,
	value: number
): boolean => {
	if (isNumberProperty(obj, name)) {
		obj[name] = value; // eslint-disable-line no-param-reassign
		return true;
	}
	return false;
};

export const isBooleanProperty = (
	obj: object,
	name: string
): obj is AnyPropBoolean => {
	if (objectHasProperty(obj, name)) {
		return typeof obj[name] === 'boolean';
	}
	return false;
};

export const assignBooleanProperty = (
	obj: object,
	name: string,
	value: boolean
): boolean => {
	if (isBooleanProperty(obj, name)) {
		obj[name] = value; // eslint-disable-line no-param-reassign
		return true;
	}
	return false;
};

export const assignProperty = (
	obj: object,
	name: string,
	value: any
): boolean => {
	switch (typeof value) {
		case 'string':
			return assignStringProperty(obj, name, value);
		case 'number':
			return assignNumberProperty(obj, name, value);
		case 'boolean':
			return assignBooleanProperty(obj, name, value);
		default:
			throw new PropertyTypeError(
				`Unsupported value type: ${typeof value}`
			);
	}
};
