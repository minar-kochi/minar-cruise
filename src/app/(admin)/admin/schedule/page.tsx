import { DataTableDemo } from "@/components/admin/dashboard/Schedule/ScheduleTable";
import { Suspense } from "react";
import ScheduleBarWrapper from "@/container/admin/schedule/ScheduleBarWrapper";
import ScheduleSelectorLoader from "@/components/admin/dashboard/Schedule/Loader/ScheduleSelectorLoader";
import ScheduleTable from "@/components/admin/dashboard/Schedule/scheduleTable/schedule-table";
import { trpc } from "@/app/_trpc/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import OpenScheduleButton from "@/components/admin/dashboard/Schedule/OpenScheduleButton";
import ScheduleBar from "@/container/admin/schedule/ScheduleContainer";

export default async function ScheduleAdminPage() {
  return (
    <main className="">
      <div className="grid grid-cols-[75%_25%]">
        <div className="px-2">
          <div className="flex mt-12  items-center justify-center">
            <div className="">
              <h1 className=" text-2xl  font-bold">Recent Schedules</h1>
            </div>
          </div>
          <div className="relative z-10">
            <ScheduleTable />
          </div>
        </div>
        <div className="px-2 border-l">
          <ScheduleBar />
        </div>
      </div>
    </main>
  );
}
