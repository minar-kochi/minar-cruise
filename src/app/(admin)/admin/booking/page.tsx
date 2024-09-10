import AllSchedules from "@/components/admin/booking/AllSchedules";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";
import OpenScheduleButton from "@/components/admin/dashboard/Schedule/OpenScheduleButton";
import ScheduleDownloadButton from "@/components/admin/dashboard/Schedule/scheduleTable/ScheduleDownloadButton";
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
          <div className="flex gap-3">
            <RouterRefreshButton/>
            <ScheduleDownloadButton type="scheduleWithBookingCount"/>
            <OpenScheduleButton />
          </div>
        </div>

        <AllSchedules />
      </div>
    </div>
  );
}
