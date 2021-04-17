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

import {
	assignBooleanProperty,
	assignNumberProperty,
	assignProperty,
	assignStringProperty,
	isBooleanProperty,
	isNumberProperty,
	isStringProperty,
	PropertyTypeError
} from '../../utils/propertyTypes';

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
			const result = assignNumberProperty(obj, 'two', 3);
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
			const result = assignBooleanProperty(obj, 'three', true);
			expect(result).toEqual(true);
			expect(obj.three).toEqual(true);
		});

		it('is not boolean property', () => {
			const result = assignBooleanProperty(obj, 'one', true);
			expect(result).toEqual(false);
			expect(obj.three).toEqual(false);
		});
	});

	describe('assignProperty', () => {
		it('string property', () => {
			const result = assignProperty(obj, 'one', 'foo');
			expect(result).toEqual(true);
			expect(obj.one).toEqual('foo');
		});

		it('number property', () => {
			const result = assignProperty(obj, 'two', 3);
			expect(result).toEqual(true);
			expect(obj.two).toEqual(3);
		});

		it('boolean property', () => {
			const result = assignProperty(obj, 'three', true);
			expect(result).toEqual(true);
			expect(obj.three).toEqual(true);
		});

		it('unsupported property', () => {
			try {
				assignProperty(obj, 'one', {});
			} catch (ex) {
				expect(ex).toBeInstanceOf(PropertyTypeError);
				expect(ex.message).toEqual('Unsupported value type: object');
				return;
			}
			throw new Error("Test should've thrown error");
		});
	});
});
