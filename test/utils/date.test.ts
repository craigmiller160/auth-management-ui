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
  displayFormatApiDateTime,
  formatApiDateTime,
  parseApiDateTime,
} from '../../src/utils/date';

const dateTimeString = '2020-12-11T19:34:08.785314Z';
const formattedDateTimeString = '2020-12-11 02:34:08 PM';
const expectedDate = new Date('2020-12-11T19:34:08.785314Z');

describe('date functions', () => {
  it('parseApiDateTime', () => {
    const date = parseApiDateTime(dateTimeString);
    expect(date.getTime()).toEqual(expectedDate.getTime());
  });

  it('displayFormatApiDateTime', () => {
    // This test depends on being run in Eastern Time
    const result = displayFormatApiDateTime(dateTimeString);
    expect(result).toEqual(formattedDateTimeString);
  });

  it('formatApiDateTime', () => {
    // This test depends on being run in Eastern Time
    const result = formatApiDateTime(dateTimeString);
    expect(result).toEqual(formattedDateTimeString);
  });

  it('formatApiDateTime null value', () => {
    const result = formatApiDateTime(null);
    expect(result).toEqual('');
  });
});
