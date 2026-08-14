import BookingLinkTable from "@/components/admin/booking-link/BookingLinkTable";

export default function BookingLinksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Booking links</h1>
        <p className="mt-1 text-muted-foreground">
          Payment links sent to customers. Each one is single use and stops
          working once paid.
        </p>
      </header>

      <BookingLinkTable />
    </div>
  );
}
