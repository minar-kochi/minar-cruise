import OfflineBookingForm from "@/components/admin/booking/OfflineBookingForm";
import { getBookedDetails } from "@/db/data/dto/booking";
import { unstable_noStore as noStore } from "next/cache";
interface IUpdateBookingProps {
  params: { bookingId: string };
  searchParams: { scheduleId: string}
}

export default async function UpdateBooking({
  params: { bookingId },
  searchParams: { scheduleId }
}: IUpdateBookingProps) {
  noStore();
  // fetch booking data and related fields of payment that is neeeded in the form.
  const bookedDetails = await getBookedDetails(bookingId);
  if (!bookedDetails) return null;

  return (
    <div>
      {/* Pass in prefill data here  */}
      <OfflineBookingForm
        scheduleId={bookedDetails.scheduleId}
        type="UPDATE"
        prefillData={bookedDetails}
      />
    </div>
  );
}
