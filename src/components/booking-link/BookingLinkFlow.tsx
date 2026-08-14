"use client";

import { trpc } from "@/app/_trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { BookingLinkCheckout } from "./BookingLinkCheckout";
import { BookingLinkConfirmed } from "./BookingLinkConfirmed";
import {
  BookingLinkSkeleton,
  BookingLinkUnavailable,
} from "./BookingLinkStates";
import { StepIndicator } from "./StepIndicator";

/**
 * Owns the two-step state for /book/[token].
 *
 * Step 2 is simply the post-payment state of the same page rather than a
 * separate route: Razorpay's `handler` callback fires in-page, so a redirect
 * would only lose the bookingId we already hold.
 */
export default function BookingLinkFlow({ token }: { token: string }) {
  const [paidBookingId, setPaidBookingId] = useState<string | null>(null);

  const { data, isLoading, error } = trpc.user.bookingLink.getByToken.useQuery(
    { token },
    { retry: false, refetchOnWindowFocus: false },
  );

  if (paidBookingId) {
    return (
      <>
        <StepIndicator step={2} />
        <BookingLinkConfirmed bookingId={paidBookingId} />
      </>
    );
  }

  if (isLoading) return <BookingLinkSkeleton />;

  if (error) {
    const code =
      error instanceof TRPCClientError ? error.data?.code : undefined;

    const variant =
      code === "NOT_FOUND"
        ? "not-found"
        : code === "CONFLICT"
          ? "already-paid"
          : code === "FORBIDDEN"
            ? "expired"
            : "error";

    return <BookingLinkUnavailable variant={variant} message={error.message} />;
  }

  if (!data) return <BookingLinkUnavailable variant="error" />;

  return (
    <>
      <StepIndicator step={1} />
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Complete your booking
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Check the details below and pay to confirm your seats.
        </p>
      </header>

      <BookingLinkCheckout link={data} onPaid={setPaidBookingId} />
    </>
  );
}
