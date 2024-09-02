import AllSchedules from "@/components/admin/booking/AllSchedules";
import OpenScheduleButton from "@/components/admin/dashboard/Schedule/OpenScheduleButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  
  return (
    <div className="">
      <h2 className="text-xl md:text-3xl font-bold border flex justify-center py-8 border-b">
        Select a schedule
      </h2>
      <div className="">
        {/* //add something else */}
        <div className="flex justify-between p-5">
          <Link href={`/admin`}>
            <Button className="">Back</Button>
          </Link>
          <OpenScheduleButton />
        </div>

        <AllSchedules />
      </div>
    </div>
  );
}
