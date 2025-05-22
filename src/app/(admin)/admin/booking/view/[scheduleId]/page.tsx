import BookingPageWrapper from "@/components/admin/booking/BookingPageWrapper";
import Loader from "@/components/custom/Loading";
import { Suspense } from "react";

interface IViewBooking {
  params: {
    scheduleId: string;
  };
  searchParams: {
    [key in string]: string;
  };
}

export default async function ViewBooking({
  params: { scheduleId },
  searchParams,
}: IViewBooking) {
  return (
    <Suspense fallback={<Loader className="h-[calc(100vh-65px)]" />}>
      <BookingPageWrapper scheduleId={scheduleId} />
    </Suspense>
  );
}
