
// TODO make separate library

type AnyPropName = {
    [name: string]: any
};

export type AnyPropString = {
    [name: string]: string
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

export const objectHasProperty = (obj: object, name: string): obj is AnyPropName => {
    return obj.hasOwnProperty(name);
};

export const isStringProperty = (obj: object, name: string): obj is AnyPropString => {
    if (objectHasProperty(obj, name)) {
        return typeof obj[name] === 'string';
    }
    return false;
};

export const assignStringProperty = (obj: object, name: string, value: string): boolean => {
    if (isStringProperty(obj, name)) {
        obj[name] = value;
        return true;
    }
    return false;
};

export const isNumberProperty = (obj: object, name: string): obj is AnyPropNumber => {
    if (objectHasProperty(obj, name)) {
        return typeof obj[name] === 'number';
    }
    return false;
};

export const assignNumberProperty = (obj: object, name: string, value: number): boolean => {
    if (isNumberProperty(obj, name)) {
        obj[name] = value;
        return true;
    }
    return false;
};

export const isBooleanProperty = (obj: object, name: string): obj is AnyPropBoolean => {
    if (objectHasProperty(obj, name)) {
        return typeof obj[name] === 'boolean';
    }
    return false;
};

export const assignBooleanProperty = (obj: object, name: string, value: boolean): boolean => {
    if (isBooleanProperty(obj, name)) {
        obj[name] = value;
        return true;
    }
    return false;
};

export const assignProperty = (obj: object, name: string, value: any): boolean => {
    switch (typeof value) {
        case 'string':
            return assignStringProperty(obj, name, value);
        case 'number':
            return assignNumberProperty(obj, name, value);
        case 'boolean':
            return assignBooleanProperty(obj, name, value);
        default:
            throw new PropertyTypeError(`Unsupported value type: ${typeof value}`);
    }
}