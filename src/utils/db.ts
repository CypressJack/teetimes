import { filterDates, getNextSixDaysPST, sortTeeTimes } from "./dates";
import { prisma } from "@/lib/db";

export async function getDbTeeTimes(){
  const dates = getNextSixDaysPST();
  let teeTimeDates = [];

  for (const date of dates) {
    const teeTimes = await prisma.teeTime.findMany({ where: { date: date } });
    if (teeTimes) {
      const filteredTeeTimes = filterDates(teeTimes, date);
      const sortedTeeTimes = sortTeeTimes(filteredTeeTimes);
      teeTimeDates.push(sortedTeeTimes);
    }
  }

  return teeTimeDates;
}