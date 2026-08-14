import GenerateBookingLinkForm from "@/components/admin/booking-link/GenerateBookingLinkForm";

export default function GenerateBookingLinkPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Generate booking link</h1>
        <p className="mt-1 text-muted-foreground">
          Create a payment link to send a customer after a booking call. The
          booking is added automatically once they pay.
        </p>
      </header>

      <GenerateBookingLinkForm />
    </div>
  );
}
