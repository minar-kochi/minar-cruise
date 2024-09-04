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
      <div className="flex justify-center  flex-col items-center gap-2 my-6">
        <h1 className="text-4xl font-bold">Schedule Page</h1>
        <p className="max-w-prose text-center text-muted-foreground">
          Manage and add schedules effortlessly. View existing schedules, create
          or update time slots, and select packages for various events like
          breakfast, lunch, and more.
        </p>
      </div>

      <div className=" lg:grid">
        <div className="px-2">
          <div className="hidden lg:block px-2  group schedule-page">
            <ScheduleBar />
          </div>
          <div className="flex mt-12  items-center justify-center">
            <div className="">
              <h1 className=" text-2xl  font-bold">Recent Schedule&apos;s</h1>
            </div>
          </div>
          <div
            id="schedule-table"
            className="relative z-10 mb-96 schedule-page"
          >
            <ScheduleTable />
          </div>
        </div>
      </div>
    </main>
  );
}
