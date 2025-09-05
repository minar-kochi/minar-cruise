import {
  getBookingsByScheduleId,
  TGetBookingsByScheduleId,
} from "@/db/data/dto/schedule/schedule";
import { ChevronLeft } from "lucide-react";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";
import CustomLinkButton from "@/components/custom/CustomLinkButton";
import MoveAllBookingsButton from "@/components/admin/booking/MoveAllBookingsButton";
import DownloadBookingButton from "@/components/excel/DownloadBookingButton";
import BookingTable from "@/components/admin/booking/BookingTable";

export default async function BookingPageWrapper({
  scheduleId,
}: {
  scheduleId: string;
}) {
  const bookings: TGetBookingsByScheduleId =
    await getBookingsByScheduleId(scheduleId);

  return (
    <div className="">
      <h2 className="font-bold text-3xl text-center py-5">Booking data</h2>
      <div className="flex max-sm:flex-col max-sm:gap-3 justify-between p-3">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center justify-center">
            <CustomLinkButton
              icon={<ChevronLeft size={20} />}
              href={`/admin/booking`}
              label="Back"
              props={{
                variant: "secondary",
              }}
              className="flex pl-2 justify-between"
            />
            {bookings?.length ? (
              <DownloadBookingButton tableData={bookings} />
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap max-sm:justify-between max-sm:w-full sm:gap-5">
          <RouterRefreshButton className="border" />
          <MoveAllBookingsButton
            disabled={!bookings?.length ? true : false}
            scheduleId={scheduleId}
            className="max-sm:order-first"
          />
          <CustomLinkButton
            href={`/admin/booking/add/${scheduleId}`}
            label="Add Booking"
            className="min-w-[140px]"
          />
        </div>
      </div>
      <div className="rounded-md p-2 border m-2 bg-sidebar">
        <BookingTable scheduleId={scheduleId} bookings={bookings} />
      </div>
      <div className="py-5 font-bold">
        {!bookings?.length ? (
          <p className="max-w-max mx-auto">Booking Empty</p>
        ) : null}
      </div>
    </div>
  );
}
