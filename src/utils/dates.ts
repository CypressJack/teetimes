import { addDays, getDate, getYear, getMonth, parse, getUnixTime, addHours, isAfter, isBefore } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';
import { TeeTime } from '@prisma/client';

export function newFunction() {
  return true;
}

export function getNextSixDaysPST() {
  const timeZone = 'America/Los_Angeles';
  let dates = [];

  for (let i = 0; i < 7; i++) {
    // Get the current date and time, convert to PST/PDT, then add the day offset
    const utcDate = new Date();
    const zonedDate = utcToZonedTime(utcDate, timeZone);
    const adjustedDate = addDays(zonedDate, i);
    // Format the date in 'yyyy-MM-dd' format
    const dateString = format(adjustedDate, 'yyyy-MM-dd', { timeZone });
    dates.push(dateString);
  }

  return dates;
}

function isDaylightSavings(date: Date) {
  const daylightStart2024 = parse('2024-03-10T02:00', "yyyy-MM-dd'T'HH:mm", new Date());
  const daylightEnd2024 = parse('2024-09-03T02:00', "yyyy-MM-dd'T'HH:mm", new Date());

  if (isAfter(date, daylightStart2024) && isBefore(date, daylightEnd2024)) {
    return true;
  } else {
    return false;
  }
}

function timeHasPassed(date: Date, currentTimestampUTC: number) {
  let teeTimeTimestampUTC;

  if (isDaylightSavings(date)) {
    teeTimeTimestampUTC = getUnixTime(addHours(date, 7));
  } else {
    teeTimeTimestampUTC = getUnixTime(addHours(date, 8));
  }
  let isInThePast = teeTimeTimestampUTC < currentTimestampUTC;

  return isInThePast ? false : true;
}

export function filterDates(teeTimes: TeeTime[], dateString: string) {
  const currentTimestampUTC = getUnixTime(new Date());
  return teeTimes.filter((teeTime) => {
    const timeString = teeTime.start_time;
    const dateTimeString = `${dateString}T${timeString}`;
    const date = parse(dateTimeString, "yyyy-MM-dd'T'HH:mm", new Date());
    teeTime.start_time = format(date, 'p');
    return timeHasPassed(date, currentTimestampUTC);
  })
}

export function sortTeeTimes(teeTimes: TeeTime[]) {
  if (!Array.isArray(teeTimes)) return teeTimes;
  const sortedTeeTimes = teeTimes.toSorted((a, b) => a.id > b.id ? 1 : -1)
  return sortedTeeTimes;
}

export function filterAndFormatDates(events: TeeTime[], dateString: string) {
  const timeZone = 'America/Los_Angeles';
  const now = new Date();
  const zonedNow = utcToZonedTime(now, timeZone);
  const currentDateStr = format(zonedNow, 'yyyy-MM-dd');

  let filteredEvents = events;

  // If the date string matches today's date, filter out past events
  if (dateString === currentDateStr) {
    filteredEvents = events.filter(item => {
      const eventTime = zonedTimeToUtc(`${dateString}T${item.start_time}:00`, timeZone);
      return eventTime >= zonedNow;
    });
  }

  // Sort by start_time and convert to 12-hour format
  filteredEvents.sort((a, b) => a.start_time.localeCompare(b.start_time)).forEach(item => {
    const [hours, minutes] = item.start_time.split(':');
    const hours12 = ((parseInt(hours, 10) % 12) || 12).toString().padStart(2, '0');
    const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    item.start_time = `${hours12}:${minutes} ${ampm}`;
  });

  return filteredEvents;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, 'PPP');
}

export function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  return format(date, 'EEEE');
}