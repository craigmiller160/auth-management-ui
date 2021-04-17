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

import format from 'date-fns/format/index'
import parse from 'date-fns/parse/index'
import { pipe } from 'fp-ts/es6/pipeable'
import {
  fromNullable,
  getOrElse as oGetOrElse,
  map as oMap,
} from 'fp-ts/es6/Option'

export const API_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSX"
export const DISPLAY_DATE_TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss a'

export const parseApiDateTime = (apiDateTimeString: string): Date =>
  parse(apiDateTimeString, API_DATE_TIME_FORMAT, new Date())

export const displayFormatApiDateTime = (apiDateTimeString: string): string => {
  const date = parseApiDateTime(apiDateTimeString)
  return format(date, DISPLAY_DATE_TIME_FORMAT)
}

export const formatApiDateTime = (date: string | null): string =>
  pipe(
    fromNullable(date),
    oMap((value: string): string => displayFormatApiDateTime(value)),
    oGetOrElse((): string => ''),
  )
