
type AnyPropName = {
    [name: string]: any
};

export type AnyPropString = {
    [name: string]: string
};

const objHasProp = (obj: object, name: string): obj is AnyPropName => {
    return !!Object.keys(obj)
        .find((prop) => prop === name);
};

export const isStringProperty = (obj: object, name: string): obj is AnyPropString => {
    if (objHasProp(obj, name)) {
        const value = obj[name];
        return typeof value === 'string';
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
