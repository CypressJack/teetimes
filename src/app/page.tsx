import { getNextSixDaysPST, formatDate, getDayOfWeek, filterDates } from '@/utils/dates';
import { prisma } from "@/lib/db";


export default async function Home() {
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
                className="bg-black py-3"
              >
                <h2
                  className='font-bold text-lg text-center'
                >
                  {getDayOfWeek(date[0]?.date)}
                </h2>
                <h2
                  className='font-bold text-lg mb-2 text-center'
                >
                  {formatDate(date[0]?.date)}
                </h2>
              </div>
              <table className="w-full mb-8 rounded-md text-sm text-left rtl:text-right text-white">
                <thead className="text-xs bg-black uppercase text-white rounded-lg">
                  <tr
                    className='rounded-lg'
                  >
                    <th scope="col" className="px-6 py-3">
                      Tee Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Players
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {date?.map((teeTime) => {
                    if (teeTime.out_of_capacity) return null;
                    return (
                      <tr key={teeTime.id} className="border-b bg-white border-gray-400 hover:bg-gray-600 text-black">
                        <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                          {teeTime.start_time}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {teeTime.open_spots}
                        </td>
                        <td className="px-6 py-4">
                          ${teeTime.green_fee}
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
