import { DatePicker } from "@/components/admin/dashboard/DatePicker";
import DateSelector from "@/components/admin/dashboard/DateSelector";

export default function Schedule() {
  return (
    <div>
      <h1 className="font-bold text-2xl text-center border-b py-4">Schedule</h1>
      {/* <Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" className="border w-fit"/> */}
      {/* <DatePicker /> */}
      <DateSelector/>
      {/* {JSOgit N.stringify(date)} */}
    </div>
  );
}
