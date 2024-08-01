import { trpc } from "@/app/_trpc/client";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import {
  setCurrentScheduleDate,
  setSyncDatabaseUpdatesScheduleCreation,
} from "@/lib/features/schedule/ScheduleSlice";
import { RemoveTimeStampFromDate, sleep } from "@/lib/utils";
import { TScheduleSelector } from "@/Types/type";
import { format } from "date-fns";
import { Check, Loader2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

export default function ScheduleAddButton({ type }: TScheduleSelector) {
  const { invalidate, reset } = trpc.useUtils().admin.getSchedulesByDateOrNow;
  const { updatedDateSchedule, date, currentDateSchedule } = useAppSelector(
    (state) => state.schedule,
  );
  const dispatch = useAppDispatch();
  const { mutate: createNewSchedule, isPending: isLoading } =
    trpc.admin.createNewSchedule.useMutation({
      async onMutate(variables) {
        toast.loading(
          `Confirming Schedule at ${format(variables.ScheduleDate, "do 'of' LLL")}`,
        );
        await sleep(4000);
      },
      async onSuccess(data, variables, context) {
        toast.dismiss();
        await invalidate({
          ScheduleDate: RemoveTimeStampFromDate(new Date(data.day)),
        });
        dispatch(setSyncDatabaseUpdatesScheduleCreation(data, type));
        toast.success("Schedule set successfully ");
      },
      onError(error, variables, context) {
        // @TODO understand the mutation code and display the error message accordingly.
        toast.error("Something went wrong!");
      },
    });
  async function handleCreateSchedule(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    try {
      if (!updatedDateSchedule) {
        return toast.error("Package has not selected. Please select a package");
      }

      if (!updatedDateSchedule[type]?.packageId) {
        return toast.error(
          `Could not Found the package for ${type}. Please try again.`,
        );
      }

      if (!updatedDateSchedule[type]?.packageId) {
        return toast.error(
          `Could not Found the package for ${type}. Please try again.`,
        );
      }
      if (currentDateSchedule[type]?.packageId) {
        return toast.error(
          `Package is already been set for ${type}. Please try again.`,
        );
      }

      createNewSchedule({
        packageId: updatedDateSchedule[type].packageId,
        ScheduleDate: date,
        ScheduleTime: updatedDateSchedule[type].scheduleTime,
      });
    } catch (error) {
      console.log(error);
      return toast.error(`Something went wrong!. Please try again.`);
    }
  }

  return (
    <button
      onClick={handleCreateSchedule}
      className="rounded-xl border p-2 hover:bg-secondary"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
        </>
      ) : (
        <Check className="h-5 w-5" />
      )}
    </button>
  );
}
