
type AnyPropName = {
    [name: string]: any
};

const objHasProp = (obj: object, name: string): obj is AnyPropName => {
    return !!Object.keys(obj)
        .find((prop) => prop === name);
};

export const isStringProperty = (obj: object, name: string): boolean => {
    if (objHasProp(obj, name)) {
        const value = obj[name];
        console.log(typeof value);
    }
    return true;
};
