import { DataTableDemo } from "@/components/admin/dashboard/Schedule/ScheduleTable";
import { Suspense } from "react";
import ScheduleBarWrapper from "@/container/admin/schedule/ScheduleBarWrapper";
import ScheduleSelectorLoader from "@/components/admin/dashboard/Schedule/Loader/ScheduleSelectorLoader";
import ScheduleTable from "@/components/admin/dashboard/Schedule/scheduleTable/schedule-table";
import { trpc } from "@/app/_trpc/client";

export default async function ScheduleAdminPage() {
  return (
    <main className="">
      <div className="grid place-content-center md:grid-cols-[70%_30%]">
        <div className="px-2">
          <div className="flex items-center justify-center">
            <h1 className="mt-12 text-2xl font-bold">Recent Schedules</h1>
          </div>

          <div className="relative z-10 ">
            <ScheduleTable />
          </div>
        </div>
        <div className="min-h-[calc(100vh-4rem)] py-12 md:border-l">
          <div className="sticky lg:top-[70px]">
            <Suspense
              fallback={
                <div>
                  <ScheduleSelectorLoader title="Breakfast"  />
                  <ScheduleSelectorLoader title="Lunch" />
                  <ScheduleSelectorLoader title="Dinner" />
                  <ScheduleSelectorLoader title="Custom" />
                </div>
              }
            >
              <ScheduleBarWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
