import { isStringProperty } from '../../utils/isPropertyType';

const obj = {
    one: 'hello',
    two: 2
};

describe('isPropertyType', () => {
    describe('isStringProperty', () => {
        it('is a string property', () => {
            expect(isStringProperty(obj, 'one')).toEqual(true);
        });

        it('is not a string property', () => {
            expect(isStringProperty(obj, 'two')).toEqual(false);
        });
    });
});
