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
import ScheduleDownloadButton from "@/components/admin/dashboard/Schedule/scheduleTable/ScheduleDownloadButton";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";

export default async function ScheduleAdminPage() {
  return (
    <main className="">
      <HeaderTitleDescription
        title="Schedule Page"
        description="Manage and add schedules effortlessly. View existing schedules, create
          or update time slots, and select packages for various events like
          breakfast, lunch, and more."
      />
      <div className=" lg:grid">
        <div className="px-2">
          <div className="hidden lg:block px-2  group schedule-page">
            <ScheduleBar />
          </div>
          <div className="flex mt-12 mb-2 items-center md:justify-center">
            <div className="">
              <h1 className=" text-2xl font-bold">Recent Schedule&apos;s</h1>
            </div>
            <div className="absolute right-4">
              {/* @TODO

                  Hide this button if no schedules are present
              */}
              <ScheduleDownloadButton type="scheduleWithoutBookingCount"/>
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
