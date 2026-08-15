import BookingConfigForm from "@/components/admin/booking-config/BookingConfigForm";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";

export default function BookingSettingsPage() {
  return (
    <main>
      <HeaderTitleDescription
        title="Booking rules"
        description="Set how late a cruise can be booked, the boat's capacity, and the minimum party size for opening a new sailing. Saving refreshes the public pages straight away."
      />
      <div className="p-6">
        <BookingConfigForm />
      </div>
    </main>
  );
}
