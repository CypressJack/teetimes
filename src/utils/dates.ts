import { addDays, getDate, getYear, getMonth } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';
import { TeeTime } from '@prisma/client';

export function newFunction(){
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

export function formatDate(dateString:string) {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

  const timeZone = 'America/Los_Angeles';
  const zonedDate = utcToZonedTime(dateString, timeZone);
  const year = getYear(zonedDate);
  const month = months[getMonth(zonedDate)];
  const day = getDate(zonedDate);

  const ordinalSuffix = (day: number) => {
    const j = day % 10,
          k = day % 100;
    if (j === 1 && k !== 11) {
        return day + "st";
    }
    if (j === 2 && k !== 12) {
        return day + "nd";
    }
    if (j === 3 && k !== 13) {
        return day + "rd";
    }
    return day + "th";
  }

  return `${month} ${ordinalSuffix(day)}, ${year}`;
}

export function getDayOfWeek(dateString:string) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeZone = 'America/Los_Angeles';
  const zonedDate = utcToZonedTime(dateString, timeZone);
  const day = getDate(zonedDate);
  const date = new Date(dateString);
  return daysOfWeek[day];
}