import OfflineBookingForm from "@/components/admin/booking/OfflineBookingForm";

export default function page() {
  return (
    <div className="">
      <h2 className="text-xl md:text-3xl font-bold border  flex justify-center py-8 border-b">
        Add Offline Bookings
      </h2>
      <div className="">
        <OfflineBookingForm />
      </div>
    </div>
  );
}
