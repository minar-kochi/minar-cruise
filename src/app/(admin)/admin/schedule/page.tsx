import { DatePicker } from "@/components/admin/dashboard/DatePicker";
import DateSelector from "@/components/admin/dashboard/DateSelector";
import { DataTableDemo } from "@/components/admin/dashboard/Schedule/ScheduleTable";
import { getPackageScheduleDatas } from "@/db/data/dto/package";
import { getSchedule, getScheduleData } from "@/db/data/dto/schedule";
import { ScheduleStoreProvider } from "@/providers/admin/schedule-store-provider";

export default async function Schedule() {
  const schedules = await getScheduleData();
  const packages = await getPackageScheduleDatas();
  if (!packages) {
    return null;
  }
  /**
   * @TODO - AMJAD  Add Schedule Table you can either restructure @see {@link getScheduleData}
   *     to be compatible with the Table and Date Selector, either format it on the server in both and pass into table and DateSelectorF
   *
   * @TODO - AMJAD Fetch initial data for the DateSelector from server and passdown to client to get initial speed.
   *        and avoid waterfall [multiple async codes on current file you will write on future ;) ]
   * */

  return (
    <div className="">
      <h1 className="font-bold text-2xl text-center border-b py-4">Schedule</h1>
      <div className="grid grid-cols-[70%_30%] ">
        <div className="px-2">
          <h1>Schedule Table</h1>
          {/* <h1>@TODO : Data table here</h1> */}
          <div className="pl-4 relative z-10">
            <DataTableDemo />
          </div>
        </div>
        <div className="py-12 min-h-[calc(100vh-4rem)] border-l">
          <div className="sticky lg:top-[70px]">
            <ScheduleStoreProvider
              packages={packages}
              schedules={schedules ?? { BreakFast: [], Dinner: [], Lunch: [] }}
            >
              <DateSelector />
            </ScheduleStoreProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
