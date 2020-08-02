import { format, parse } from 'date-fns';

export const API_DATE_TIME_FORMAT = `yyyy-MM-dd'T'HH:mm:ss.SSSSSS`;
export const DISPLAY_DATE_TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss a';

export const parseApiDateTime = (apiDateTimeString: string): Date =>
    parse(apiDateTimeString, API_DATE_TIME_FORMAT, new Date());

export const displayFormatApiDateTime = (apiDateTimeString: string): string => {
    const date = parseApiDateTime(apiDateTimeString);
    return format(date, DISPLAY_DATE_TIME_FORMAT);
};
