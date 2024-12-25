import * as jalali from 'date-fns-jalali';
import * as dateFns from 'date-fns';

export function getDatesIntervalInHHMMSS(start: Date, end: Date, showSymbol?: boolean) {
  const hours = Math.abs(dateFns.differenceInHours(start, end));
  const duration = dateFns.intervalToDuration({ start, end });

  const result = {
    hours,
    minutes: duration.minutes,
    seconds: duration.seconds,
    negative: start > end,
  };
  return {
    formatted: `${result.hours?.toFixed().padStart(2, '0')}:${result.minutes
      ?.toFixed()
      .padStart(2, '0')}:${result.seconds?.toFixed().padStart(2, '0')}${
      showSymbol ? ` (${result.negative ? '-' : '+'})` : ''
    }`,
    ...result,
  };
}

export function getJalaliDate(date: string | Date | undefined, format = 'yyyy/MM/dd') {
  return !date ? '' : jalali.format(typeof date === 'string' ? new Date(date) : date, format);
}

export function parseJalaliDate(date: string, format: string) {
  return jalali.parse(date, format, new Date());
}

export function getDurationInHHMM(minutes: number) {
  const h = `${Math.floor(minutes / 60)}`.padStart(2, '0');
  const m = `${minutes % 60}`.padStart(2, '0');
  return `${h}:${m}`;
}

export function getHHMMInDuration(text: string) {
  const split = text.split(':');
  const h = split.at(0);
  const m = split.at(1);
  if (!h || !m) return 0;
  const parsedH = parseInt(h);
  const parsedM = parseInt(m);
  if (isNaN(parsedH) || isNaN(parsedM)) return 0;
  return parseInt(h) * 60 + parseInt(m);
}
