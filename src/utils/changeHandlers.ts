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
