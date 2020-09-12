import { format, parse } from 'date-fns';
import { pipe } from 'fp-ts/es6/pipeable';
import { fromNullable, getOrElse as oGetOrElse, map as oMap } from 'fp-ts/es6/Option';

export const API_DATE_TIME_FORMAT = `yyyy-MM-dd'T'HH:mm:ss.SSSSSS`;
export const DISPLAY_DATE_TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss a';

export const parseApiDateTime = (apiDateTimeString: string): Date =>
    parse(apiDateTimeString, API_DATE_TIME_FORMAT, new Date());

export const displayFormatApiDateTime = (apiDateTimeString: string): string => {
    const date = parseApiDateTime(apiDateTimeString);
    return format(date, DISPLAY_DATE_TIME_FORMAT);
};

export const formatApiDateTime = (date: string | null): string =>
    pipe(
        fromNullable(date),
        oMap((value: string): string => displayFormatApiDateTime(value)),
        oGetOrElse((): string => '')
    );