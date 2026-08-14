"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarX2, CircleCheck, Link2Off, Phone } from "lucide-react";

const SUPPORT_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_CUSTOMER_SUPPORT_NUMBER ??
  process.env.NEXT_PUBLIC_ENQUIRE_CONTACT ??
  "";

export function BookingLinkSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-9 w-3/5" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

/**
 * Terminal states for a link that cannot be paid. Each one tells the customer
 * what happened and gives them a way to reach a human, because the only fix is
 * for the admin to issue a new link.
 */
export function BookingLinkUnavailable({
  variant,
  message,
}: {
  variant: "not-found" | "expired" | "already-paid" | "error";
  message?: string;
}) {
  const copy = {
    "not-found": {
      icon: <Link2Off className="h-7 w-7" />,
      title: "This link isn't valid",
      body:
        message ??
        "The booking link may have been mistyped or replaced. Please check the message you received.",
    },
    expired: {
      icon: <CalendarX2 className="h-7 w-7" />,
      title: "This link has expired",
      body:
        message ??
        "Booking links are time-limited so seats aren't held indefinitely. Get in touch and we'll send a fresh one.",
    },
    "already-paid": {
      icon: <CircleCheck className="h-7 w-7" />,
      title: "This booking is already paid",
      body:
        message ??
        "Your seats are confirmed — no further payment is needed. Check your email for the ticket.",
    },
    error: {
      icon: <Link2Off className="h-7 w-7" />,
      title: "Something went wrong",
      body: message ?? "Please try again in a moment, or contact us.",
    },
  }[variant];

  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {copy.icon}
      </span>
      <h1 className="text-xl font-bold">{copy.title}</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {copy.body}
      </p>

      {SUPPORT_NUMBER ? (
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
