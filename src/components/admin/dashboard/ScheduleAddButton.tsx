import { Check, Loader2 } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
import React from "react";
import toast from "react-hot-toast";
import { TselectDate } from "./ScheduleSelector";
import { useRouter } from "next/navigation";
import { RemoveTimeStampFromDate, sleep } from "@/lib/utils";
import { format } from "date-fns";

export default function ScheduleAddButton({
  type,
}: {
  type: keyof TselectDate;
}) {
  const { invalidate, reset } = trpc.useUtils().admin.getSchedulesByDateOrNow;
  const {
    date,
    selectedSchedulePackageId,
    packages,
    updateUpcommingScheduleDates,
  } = useScheduleStore((state) => state);

  const {
    mutate: createNewSchedule,
    isPending: isLoading,
    mutateAsync,
  } = trpc.admin.createNewSchedule.useMutation({
    async onMutate(variables) {
      toast.loading(
        `Confirming Schedule at ${format(variables.ScheduleDate, "do 'of' LLL")}`
      );
      await sleep(4000);  
    },
    async onSuccess(data, variables, context) {
      toast.dismiss();
      await invalidate({
        ScheduleDate: RemoveTimeStampFromDate(new Date(data.day)),
      });
      updateUpcommingScheduleDates(type, [new Date(data.day)]);
      toast.success("Schedule set successfully ");
    },
  });
  async function handleCreateSchedule(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    if (!selectedSchedulePackageId) {
      return toast.error("Package has not selected. Please select a package");
    }

    if (!selectedSchedulePackageId[type]?.id) {
      return toast.error(`Could not Found the package for ${type}`);
    }

    await mutateAsync({
      packageId: selectedSchedulePackageId[type].id,
      ScheduleDate: date,
      ScheduleTime: selectedSchedulePackageId[type].scheduleTime,
    });
  }
  return (
    <button
      onClick={handleCreateSchedule}
      className="p-2  border rounded-xl hover:bg-secondary"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5  w-5 animate-spin" />
        </>
      ) : (
        <Check className="h-5  w-5" />
      )}
    </button>
  );
}
