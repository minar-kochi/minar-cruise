import { DataTableDemo } from "@/components/admin/dashboard/Schedule/ScheduleTable";
import { Suspense } from "react";
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
          <div className=" px-2  group schedule-page">
            <ScheduleBar />
          </div>
        </div>
      </div>
    </main>
  );
}
