export const dynamic = 'force-dynamic' // defaults to auto
import { getNextSixDaysPST } from '@/utils/dates';
import { TeeTime } from '../types';
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const days = getNextSixDaysPST();
  const promises = [];
  for (const day of days) {
    promises.push(fetchData(day));
  }
  await Promise.all(promises);
  return Response.json({ status: "ok" })
}

async function fetchData(date: string) {
  try {
    // Fetching tee times for four players
    const url = `https://www.chronogolf.com/marketplace/clubs/593/teetimes?date=${date}&course_id=573&affiliation_type_ids%5B%5D=3089&affiliation_type_ids%5B%5D=3089&affiliation_type_ids%5B%5D=3089&affiliation_type_ids%5B%5D=3089`;
    const response = await fetch(url);

    const teeTimes: TeeTime[] = await response.json();

    if (!Array.isArray(teeTimes)) {
      console.log('response', teeTimes);
      return []
    }

    for (let teeTime of teeTimes) {
      const id = teeTime.id;
      const openSpots = teeTime.out_of_capacity ? 0 : 4;

      // update existing teetime
      await prisma.teeTime.upsert({
        where: { id },
        update: {
          date: teeTime.date,
          start_time: teeTime.start_time,
          open_spots: openSpots,
          out_of_capacity: teeTime.out_of_capacity,
          green_fee: teeTime.green_fees[0].price
        },
        create: {
          id: teeTime.id,
          date: teeTime.date,
          start_time: teeTime.start_time,
          open_spots: openSpots,
          out_of_capacity: teeTime.out_of_capacity,
          green_fee: teeTime.green_fees[0].price
        }
      })

    }
    console.log('successfully fetched');
  } catch (error) {
    console.error(error);
  }
}