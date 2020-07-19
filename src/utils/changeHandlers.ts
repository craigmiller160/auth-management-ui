import { ChangeEvent } from 'react';

export interface HandledChangeEvent<T> {
    name: string;
    value: T;
}

export type SupportedHandledChangeTypes = string | boolean | number;

export const handleCheckbox = (event: ChangeEvent<HTMLInputElement>, handler: (event: HandledChangeEvent<boolean>) => void) => {
    handler({
        name: event.target.name,
        value: event.target.checked
    });
};

export const handleNumberField = (event: ChangeEvent<HTMLInputElement>, handler: (event: HandledChangeEvent<number>) => void) => {
    const value = event.target.value ? parseInt(event.target.value) : 0;
    handler({
        name: event.target.name,
        value
    });
};

export const handleTextField = (event: ChangeEvent<HTMLInputElement>, handler: (value: HandledChangeEvent<string>) => void) => {
    handler({
        name: event.target.name,
        value: event.target.value
    });
};
