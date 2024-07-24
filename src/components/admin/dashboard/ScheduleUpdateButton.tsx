import { trpc } from "@/app/_trpc/client";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
import { RefreshCw } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { TselectDate } from "./ScheduleSelector";

export default function ScheduleUpdateButton() {
  const { mutate: createNewSchedule } =
    trpc.admin.createNewSchedule.useMutation();

  const { date, selectedSchedulePackageId } = useScheduleStore(
    (state) => state
  );

  function handleCreateSchedule(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    if (!selectedSchedulePackageId) {
      return toast.error("Package has not selected. Please select a package");
    }
    if (!selectedSchedulePackageId["breakfast"]) {
      return toast.error(`Could not Found the package for {breakfast}`);
    }
    createNewSchedule({
      packageId: selectedSchedulePackageId["breakfast"],
      ScheduleDate: "",
      ScheduleTime: "BREAKFAST",
    });
  }
  return (
    <button
      onClick={handleCreateSchedule}
      className="p-2  border rounded-xl hover:bg-secondary"
    >
      <RefreshCw className="h-5  w-5" />
    </button>
  );
}
