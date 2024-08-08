import OfflineBookingForm from "@/components/admin/booking/OfflineBookingForm";
import { redirect } from "next/navigation";
import React from "react";
interface IBookOfflineScheduleProps {
  params: {
    scheduleId: string;
  };
}
export default function OfflineBooking({
  params: { scheduleId },
}: IBookOfflineScheduleProps) {
  if (!scheduleId) {
    //@TODO redirect to relative page.
    redirect("/admin/booking");
  }
  return (
    <div>
      {/* add type as ADD_BOOING */}
      <OfflineBookingForm scheduleId={scheduleId} type="ADD" />
    </div>
  );
}
