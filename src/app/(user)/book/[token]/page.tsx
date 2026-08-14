import BookingLinkFlow from "@/components/booking-link/BookingLinkFlow";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Complete your booking | Minar Cruise",
  description: "Confirm your seats and pay securely.",
  // A private, single-use payment page should never be indexed.
  noIndex: true,
});

export default function BookingLinkPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <BookingLinkFlow token={params.token} />
    </main>
  );
}
