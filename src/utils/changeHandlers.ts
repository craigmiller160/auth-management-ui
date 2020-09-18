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

import { ChangeEvent } from 'react';

export type SupportedHandledChangeTypes = string | boolean | number;

export interface HandledChangeEvent {
    name: string;
    value: SupportedHandledChangeTypes;
}

const handleCheckbox = (handler: (handledEvent: HandledChangeEvent) => void) =>
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
    handler({
        name: changeEvent.target.name,
        value: changeEvent.target.checked
    });
};

const handleNumberField = (handler: (handledEvent: HandledChangeEvent) => void) =>
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const value = changeEvent.target.value ? parseInt(changeEvent.target.value) : 0;
    handler({
        name: changeEvent.target.name,
        value
    });
};

const handleTextField = (handler: (handledEvent: HandledChangeEvent) => void) =>
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
    handler({
        name: changeEvent.target.name,
        value: changeEvent.target.value
    });
};

export const createChangeHandler = (handler: (event: HandledChangeEvent) => void) => {
    return {
        handleCheckbox: handleCheckbox(handler),
        handleNumberField: handleNumberField(handler),
        handleTextField: handleTextField(handler)
    };
};
