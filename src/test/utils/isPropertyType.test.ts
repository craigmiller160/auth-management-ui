import {
    assignBooleanProperty,
    assignNumberProperty,
    assignStringProperty, isBooleanProperty,
    isNumberProperty,
    isStringProperty
} from '../../utils/isPropertyType';

interface TestObject {
    one: string;
    two: number;
    three: boolean;
}

describe('isPropertyType', () => {
    let obj: TestObject;

    beforeEach(() => {
        obj = {
            one: 'hello',
            two: 2,
            three: false
        };
    });

    describe('isStringProperty', () => {
        it('is a string property', () => {
            expect(isStringProperty(obj, 'one')).toEqual(true);
        });

        it('is not a string property', () => {
            expect(isStringProperty(obj, 'two')).toEqual(false);
        });
    });

    describe('assignStringProperty', () => {
        it('is a string property', () => {
            const result = assignStringProperty(obj, 'one', 'foo');
            expect(result).toEqual(true);
            expect(obj.one).toEqual('foo');
        });

        it('is not a string property', () => {
            const result = assignStringProperty(obj, 'two', 'foo');
            expect(result).toEqual(false);
            expect(obj.two).toEqual(2);
        });
    });

    describe('isNumberProperty', () => {
        it('is a number property', () => {
            expect(isNumberProperty(obj, 'two')).toEqual(true);
        });

        it('is not a number property', () => {
            expect(isNumberProperty(obj, 'one')).toEqual(false);
        });
    });

    describe('assignNumberProperty', () => {
        it('is number property', () => {
            const result= assignNumberProperty(obj, 'two', 3);
            expect(result).toEqual(true);
            expect(obj.two).toEqual(3);
        });

        it('is not number property', () => {
            const result = assignNumberProperty(obj, 'one', 3);
            expect(result).toEqual(false);
            expect(obj.two).toEqual(2);
        });
    });

    describe('isBooleanProperty', () => {
        it('is a boolean property', () => {
            expect(isBooleanProperty(obj, 'three')).toEqual(true);
        });

        it('is not a boolean property', () => {
            expect(isBooleanProperty(obj, 'one')).toEqual(false);
        });
    });

    describe('assignBooleanProperty', () => {
        it('is boolean property', () => {
            const result= assignBooleanProperty(obj, 'three', true);
            expect(result).toEqual(true);
            expect(obj.three).toEqual(true);
        });

        it('is not boolean property', () => {
            const result = assignBooleanProperty(obj, 'one', true);
            expect(result).toEqual(false);
            expect(obj.three).toEqual(false);
        });
    });
});
