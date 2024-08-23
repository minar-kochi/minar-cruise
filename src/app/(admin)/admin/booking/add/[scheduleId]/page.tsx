import OfflineBookingForm from "@/components/admin/booking/OfflineBookingForm";
import { findScheduleById } from "@/db/data/dto/schedule";
import { redirect } from "next/navigation";
import React from "react";
interface IBookOfflineScheduleProps {
  params: {
    scheduleId: string;
  };
}
export default async function OfflineBooking({
  params: { scheduleId },
}: IBookOfflineScheduleProps) {
  /**
   * @TODO
   * do a db count check whether the scheduleId exists is there on data-base.
   *
   */
  const scheduleIdExists = await findScheduleById(scheduleId);
  if (!scheduleIdExists) return null;

  return (
    <div>
      {/* add type as ADD_BOOING */}
      <OfflineBookingForm scheduleId={scheduleId} type="ADD" />
    </div>
  );
}
