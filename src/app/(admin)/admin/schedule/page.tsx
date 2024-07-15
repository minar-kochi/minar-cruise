import { DatePicker } from "@/components/admin/dashboard/DatePicker";
import DateSelector from "@/components/admin/dashboard/DateSelector";
import { getSchedule, getScheduleData } from "@/db/data/dto/schedule";

export default async function Schedule() {
  const schedules = await getScheduleData();

  /**
   * @TODO - AMJAD  Add Schedule Table you can either restructure @see {@link getScheduleData}
   *     to be compatible with the Table and Date Selector, either format it on the server in both and pass into table and DateSelectorF
   *
   * @TODO - AMJAD Fetch initial data for the DateSelector from server and passdown to client to get initial speed.
   *        and avoid waterfall [multiple async codes on current file you will write on future ;) ]
   * */

  return (
    <div>
      <h1 className="font-bold text-2xl text-center border-b py-4">Schedule</h1>
      {/* <DatePicker /> */}
      <DateSelector
        data={schedules ?? { BreakFast: [], Dinner: [], Lunch: [] }}
      />
    </div>
  );
}
