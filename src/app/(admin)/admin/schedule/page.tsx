import { DataTableDemo } from "@/components/admin/dashboard/Schedule/ScheduleTable";
import ScheduleBar from "@/container/admin/schedule/ScheduleContainer";
import {
  getUpcommingScheduleDates,
  TgetUpcommingScheduleDates,
} from "@/db/data/dto/schedule";

export default async function Schedule() {
  const data = await getUpcommingScheduleDates();
  let UpcommingSchedule: TgetUpcommingScheduleDates = data ?? {
    breakfast: [],
    custom: [],
    dinner: [],
    lunch: [],
  };
  return (
    <main className="">
      <div className="grid md:grid-cols-[70%_30%] place-content-center ">
        <div className="px-2">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold mt-12">Recent Schedules</h1>
          </div>
          {/* <h1>@TODO : Data table here</h1> */}
          <div className=" relative z-10 ">
            <DataTableDemo />
          </div>
        </div>
        <div className="py-12 min-h-[calc(100vh-4rem)] md:border-l">
          <div className="sticky lg:top-[70px]">
            <ScheduleBar upCommingSchedules={UpcommingSchedule} />
          </div>
        </div>
      </div>
    </main>
  );
}
