import { assignStringProperty, isStringProperty } from '../../utils/isPropertyType';

interface TestObject {
    one: string;
    two: number;
}

describe('isPropertyType', () => {
    let obj: TestObject;

    beforeEach(() => {
        obj = {
            one: 'hello',
            two: 2
        };
    });

    describe('isStringProperty', () => {
        it('is a string property', () => {
            expect(isStringProperty(obj, 'one')).toEqual(true);
        });

        it('is not a string property', () => {
            expect(isStringProperty(obj, 'two')).toEqual(false);
        });

        it('can assign value to string property', () => {
            if (isStringProperty(obj, 'one')) {
                obj['one'] = 'foo';
            }
            expect(obj.one).toEqual('foo');
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
});
