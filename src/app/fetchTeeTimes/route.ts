export const dynamic = 'force-dynamic' // defaults to auto
import { getNextSixDaysPST } from '@/utils/dates';
import { TeeTime } from '../types';
import { prisma } from "@/lib/db";
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = headers();

  const days = getNextSixDaysPST();

  for (const day of days) {
    await fetchData(day);
  }
  
  return Response.json({ status: "ok" })
}

async function fetchData(date: string) {
  try {
    // Fetching tee times for four players
    const response = await fetch(`https://www.chronogolf.com/marketplace/clubs/593/teetimes?date=${date}&course_id=573&affiliation_type_ids%5B%5D=3089&affiliation_type_ids%5B%5D=3089&affiliation_type_ids%5B%5D=3089&affiliation_type_ids%5B%5D=3089`);

    const teeTimes: TeeTime[] = await response.json();

    for (let teeTime of teeTimes) {
      const id = teeTime.id;
      const openSpots = teeTime.out_of_capacity ? 0 : 4;
      const dbTeeTime = await prisma.teeTime.findUnique(
        {
          where: { id: id }
        }
      )

      if (dbTeeTime) {
        if (dbTeeTime.out_of_capacity === false && teeTime.out_of_capacity === true) {
          // do something when it has changed
        }


        // update existing teetime
        await prisma.teeTime.update({
          where: { id },
          data: {
            date: teeTime.date,
            start_time: teeTime.start_time,
            open_spots: openSpots,
            out_of_capacity: teeTime.out_of_capacity,
            green_fee: teeTime.green_fees[0].price
          }
        })
      }

      // create new teetime
      if (!dbTeeTime) {
        await prisma.teeTime.create({
          data: {
            id: teeTime.id,
            date: teeTime.date,
            start_time: teeTime.start_time,
            open_spots: openSpots,
            out_of_capacity: teeTime.out_of_capacity,
            green_fee: teeTime.green_fees[0].price
          }
        })
      }
    }
    console.log('successfully fetched');

  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
}