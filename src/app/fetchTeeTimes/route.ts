export const dynamic = 'force-dynamic' // defaults to auto
import { getNextSixDaysPST } from '@/utils/dates';
import { TeeTime } from '../types';
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date');
  if (date) {
    await fetchData(date);
    return Response.json({ status: "ok" })
  }
  else {
    return Response.json({ status: "no date provided" })
  }
}

// async function fetchOneWeek() {
//   const days = getNextSixDaysPST();

//   for (const day of days) {
//     setTimeout(async () => {
//       await fetchData(day);
//     }, 5000);
//   }
// }

async function fetchData(date: string) {
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

}