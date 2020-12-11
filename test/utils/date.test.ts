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

import { parseApiDateTime } from '../../src/utils/date';

const dateTimeString = '2020-12-11T19:34:08.785314Z';
const expectedDate = new Date(2020, 11, 11, 19, 34, 8, 785);

describe('date functions', () => {
    it('parseApiDateTime', () => {
        const date = parseApiDateTime(dateTimeString);
        expect(date.getTime()).toEqual(expectedDate.getTime());
    });

    it('displayFormatApiDateTime', () => {
        throw new Error();
    });

    it('formatApiDateTime', () => {
        throw new Error();
    });

    it('formatApiDateTime null value', () => {
        throw new Error();
    });
});
