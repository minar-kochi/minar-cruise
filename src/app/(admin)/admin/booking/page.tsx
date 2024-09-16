import AllSchedules from "@/components/admin/booking/AllSchedules";
import ScheduleDownloadButton from "@/components/admin/dashboard/Schedule/scheduleTable/ScheduleDownloadButton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="">
      <h2 className="text-xl md:text-3xl font-bold flex justify-center py-8">
        Select a schedule
      </h2>
      <div className="">
        {/* //add something else */}
        <div className="flex justify-between p-5">
          <Link href={`/admin`}>
            <Button variant={"secondary"} className="pl-2">
              <ChevronLeft size={20} />
              Back
            </Button>
          </Link>
          <div className="flex gap-3">
            <ScheduleDownloadButton type="scheduleWithBookingCount" />
          </div>
        </div>

        <AllSchedules />
      </div>
    </div>
  );
}
