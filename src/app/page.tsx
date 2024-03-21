import { getNextSixDaysPST, formatDate, getDayOfWeek, filterDates } from '@/utils/dates';
import { prisma } from "@/lib/db";
import { headers } from 'next/headers'

export default async function Home() {
  const headersList = headers();
  const dates = getNextSixDaysPST();
  let teeTimeDates = [];

  for (const date of dates) {
    const teeTimes = await prisma.teeTime.findMany({ where: { date: date } });
    if (teeTimes) {
      const sortedTeeTimes = filterDates(teeTimes, date);
      teeTimeDates.push(sortedTeeTimes);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-12">
      <h1
        className="font-bold text-3xl px-4 text-center pb-2"
      >
        Tsawwassen Springs
      </h1>
      <h1
        className="font-bold text-2xl px-4 text-center pb-6"
      >
        Available Tee Times
      </h1>
      <div className="overflow-x-auto">
        {teeTimeDates?.map((date, i) => {
          if (!date.length) return null;
          return (
            <div
              key={`date-${i}`}
            >
              <div
                className="bg-green-950 py-3"
              >
                <h2
                  className='font-bold text-lg text-center'
                >
                  {getDayOfWeek(date[0]?.date)}
                </h2>
                <h2
                  className='font-bold text-lg mb-1 text-center'
                >
                  {formatDate(date[0]?.date)}
                </h2>
              </div>
              <table className="w-full mb-8 rounded-md text-sm text-left rtl:text-right text-white">
                <thead className="text-xs bg-green-950 uppercase text-white rounded-lg">
                  <tr
                    className='rounded-lg'
                  >
                    <th scope="col" className="px-6 py-3">
                      Tee Time
                    </th>
                    <th scope="col" className="px-2 py-3">
                      Spots
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {date?.map((teeTime) => {
                    if (teeTime.out_of_capacity) return null;
                    const bookingUrl = `https://www.chronogolf.com/club/593/widget?target=_blank&source=chronogolf&medium=profile#?course_id=573&nb_holes=18&date=${teeTime.date}&affiliation_type_ids=3089,3089,3089,3089&teetime_id=${teeTime.id}&is_deal=false`
                    return (
                      <tr key={teeTime.id} className="border-b bg-white border-gray-400 hover:bg-gray-400 text-black">
                        <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                          {teeTime.start_time}
                        </td>
                        <td className="px-3 py-4 text-center ">
                          {teeTime.open_spots}
                        </td>
                        <td className="px-3 py-4 font-semibold">
                          ${teeTime.green_fee}
                        </td>
                        <td className="px-3 py-4 ">
                          <a
                            rel='nofollow; noindex;'
                            target='_blank'
                            href={bookingUrl}
                            className="cursor-pointer font-semibold focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          >
                            Book
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table >
            </div>
          )
        })}
      </div>
    </main>
  );
}
