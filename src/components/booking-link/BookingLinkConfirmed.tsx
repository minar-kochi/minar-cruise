"use client";

import { trpc } from "@/app/_trpc/client";
import CruiseTicket from "@/components/admin/dashboard/ticket/cruise-ticket";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { useRef } from "react";

const SUPPORT_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_CUSTOMER_SUPPORT_NUMBER ??
  process.env.NEXT_PUBLIC_ENQUIRE_CONTACT ??
  "";

/** ~60s of polling at 2s. Webhook latency is usually a second or two. */
const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 30;

export function BookingLinkConfirmed({ bookingId }: { bookingId: string }) {
  const polls = useRef(0);

  const { data, isError } = trpc.user.getUserBookingDetails.useQuery(
    { bookingId },
    {
      refetchInterval({ state }) {
        if (state.data) return false;
        if (polls.current >= MAX_POLLS) return false;
        polls.current++;
        return POLL_INTERVAL_MS;
      },
      retry: false,
    },
  );

  /**
   * The payment has already succeeded at this point — only the webhook's
   * database write is outstanding. Never show this as an error state; the
   * customer's money is taken and the booking will land.
   */
  if (!data) {
    const gaveUp = polls.current >= MAX_POLLS || isError;

    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          {gaveUp ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <Loader2 className="h-7 w-7 animate-spin" />
          )}
        </span>

        <h1 className="text-xl font-bold">Payment received</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {gaveUp
            ? "Your payment went through and your booking is being finalised. The confirmation email will arrive shortly — no need to pay again."
            : "Confirming your booking…"}
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          Booking reference{" "}
          <span className="font-mono font-medium text-foreground">
            {bookingId}
          </span>
        </p>

        {gaveUp && SUPPORT_NUMBER ? (
          <Button asChild variant="outline" className="mt-6">
            <a href={`tel:${SUPPORT_NUMBER}`}>
              <Phone className="mr-2 h-4 w-4" />
              {SUPPORT_NUMBER}
            </a>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="text-2xl font-bold">Booking confirmed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A confirmation email is on its way. Please arrive 30 minutes before
          departure.
        </p>
      </div>

      <CruiseTicket data={data} />
    </div>
  );
}
