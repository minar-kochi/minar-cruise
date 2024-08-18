import AllSchedules from "@/components/admin/booking/AllSchedules";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  return (
    <div className="">
      <h2 className="text-xl md:text-3xl font-bold border  flex justify-center py-8 border-b">
        Select a schedule
      </h2>
      <div className="">
        {/* //add something else */}
        <div className="flex justify-between p-5">
          <Link href={`/admin`}>
            <Button className="">Back</Button>
          </Link>
          <Link href={`/admin/schedule`}>
            <Button className="">Add new Schedule</Button>
          </Link>
        </div>

        <AllSchedules />
      </div>
    </div>
  );
}
