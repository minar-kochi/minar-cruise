import { TIsScheduleInputsChanged } from "@/lib/features/schedule/selector";
import { format } from "date-fns";
import type ScheduleUpdateButton from "@/components/admin/dashboard/Schedule/ScheduleUpdateButton";
/**
 * @TODO {NIEL} fill in schedule tite, as the name suggest using the type @see {@link TIsScheduleInputsChanged}
 * This is used inside @see {@link ScheduleUpdateButton}
 */
export const getScheduleTitle = ({
  date,
  isScheduleStatus,
}: {
  isScheduleStatus: TIsScheduleInputsChanged;
  date: string | Date;
}) => {
  if (isScheduleStatus.isAllChanged) {
    return `Please make sure that you have already changed all the bookings at ${format(date, "dd-MM-yyyy")} before changing.`;
  }
  if (isScheduleStatus.isPackageOnlyChanged) {
  }
};
