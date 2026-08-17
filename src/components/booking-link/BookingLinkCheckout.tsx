"use client";
import { formatIstRange } from "@/lib/datetime";

import { trpc } from "@/app/_trpc/client";
import { GuestStepper, GuestStepperGroup } from "./GuestStepper";
import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Button } from "@/components/ui/button";
import { computeBookingLinkQuote } from "@/lib/helpers/bookingLink/quote";
import { phoneNumberParser } from "@/lib/helpers/CommonBuisnessHelpers";
import { cn, formatPrice } from "@/lib/utils";
import {
  bookingLinkCheckoutSchema,
  TBookingLinkCheckout,
} from "@/lib/validators/bookingLink";
import type { AppRouter } from "@/server/routers";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";
import { dayKeyOfDateColumn, formatDayKey } from "@/lib/datetime";
import {
  CalendarRange,
  Clock,
  Info,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

/**
 * Dates arrive as ISO strings — this tRPC instance has no superjson
 * transformer — but every consumer here goes through `new Date(...)`, which
 * accepts both, so the inferred server type is still the right contract.
 */
export type TBookingLinkPublic =
  inferRouterOutputs<AppRouter>["user"]["bookingLink"]["getByToken"];

/** 16px on phones: below that, iOS Safari auto-zooms when the field is focused. */
const MOBILE_SAFE_INPUT = "text-base sm:text-sm";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BookingLinkCheckout({
  link,
  onPaid,
}: {
  link: TBookingLinkPublic;
  onPaid: (bookingId: string) => void;
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TBookingLinkCheckout>({
    resolver: zodResolver(bookingLinkCheckoutSchema),
    defaultValues: {
      token: link.token,
      name: link.prefill.name,
      email: link.prefill.email,
      phone: link.prefill.phone,
      numOfAdults: link.prefill.adultCount,
      numOfChildren: link.prefill.childCount,
      numOfBaby: link.prefill.babyCount,
    },
  });

  const adults = watch("numOfAdults");
  const children = watch("numOfChildren");
  const babies = watch("numOfBaby");

  const quote = computeBookingLinkQuote({
    adultPricePaise: link.adultPricePaise,
    childPricePaise: link.childPricePaise,
    gstRate: link.gstRate,
    adultCount: adults,
    childCount: children,
    paymentType: link.paymentType,
    advancePercent: link.advancePercent,
  });

  const isAdvance = link.paymentType === "ADVANCE";
  const noGuests = adults + children < 1;
  const overCapacity =
    link.seatsLeft !== null && adults + children + babies > link.seatsLeft;

  const { mutate: createOrder, isPending } =
    trpc.user.bookingLink.createOrder.useMutation({
      onSuccess(res) {
        /**
         * `handler` rather than `callback_url`: callback_url puts Razorpay into
         * redirect mode and it POSTs back, which an App Router page.tsx cannot
         * answer. Staying in the SPA also means we already hold the bookingId
         * for the confirmation step.
         */
        const rzp = new window.Razorpay({
          key: res.keyId,
          amount: res.order.amount,
          currency: "INR",
          order_id: res.order.id,
          name: "Minar Cruise",
          description: link.package.title,
          prefill: {
            name: watch("name"),
            email: watch("email"),
            contact: phoneNumberParser(watch("phone")),
          },
          theme: { color: "#e11d48" },
          handler: () => onPaid(res.bookingId),
          modal: {
            ondismiss: () =>
              toast("Payment cancelled — your seats aren't booked yet.", {
                icon: "⚠️",
              }),
          },
        });
        rzp.open();
      },
      onError(error) {
        toast.error(
          error instanceof TRPCClientError
            ? error.message
            : "Could not start the payment. Please try again.",
          { duration: 6000 },
        );
      },
    });

  async function onSubmit(data: TBookingLinkCheckout) {
    let recaptchaToken: string | null = null;
    if (executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha("BookingLinkCheckout");
      } catch {
        recaptchaToken = null;
      }
    }
    createOrder({ ...data, recaptchaToken });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ---- 1. package ------------------------------------------------- */}
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="flex gap-4 p-4">
          {link.package.imageUrl ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-32">
              <Image
                src={link.package.imageUrl}
                alt={link.package.imageAlt}
                fill
                sizes="(max-width: 640px) 80px, 128px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight">
              {link.package.title}
            </h2>
            {link.package.amenities.length ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {link.package.amenities.slice(0, 3).join(" · ")}
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                {formatDayKey(dayKeyOfDateColumn(link.scheduleDay), "dateFull")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {formatIstRange(link.scheduleStartsAt, link.scheduleEndsAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. details -------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="font-semibold">Your details</h2>
        <div className="space-y-2">
          <InputLabel
            errorMessage={errors.name?.message}
            InputProps={{
              placeholder: "Full name",
              className: MOBILE_SAFE_INPUT,
              ...register("name"),
            }}
          />
          <InputLabel
            errorMessage={errors.phone?.message}
            InputProps={{
              placeholder: "Phone number",
              inputMode: "tel",
              autoComplete: "tel",
              className: MOBILE_SAFE_INPUT,
              ...register("phone"),
            }}
          />
          <InputLabel
            errorMessage={errors.email?.message}
            InputProps={{
              placeholder: "Email address",
              type: "email",
              inputMode: "email",
              autoComplete: "email",
              className: MOBILE_SAFE_INPUT,
              ...register("email"),
            }}
          />
        </div>
      </section>

      {/* ---- 3. guests --------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="font-semibold">Number of guests</h2>
        <GuestStepperGroup>
          <GuestStepper
            label="Adults"
            hint="12+ years"
            value={adults}
            max={150}
            onChange={(v) => setValue("numOfAdults", v, { shouldValidate: true })}
          />
          <GuestStepper
            label="Children"
            hint="5–12 years"
            value={children}
            max={120}
            onChange={(v) =>
              setValue("numOfChildren", v, { shouldValidate: true })
            }
          />
          <GuestStepper
            label="Infants"
            hint="Under 5 · not charged"
            value={babies}
            max={50}
            onChange={(v) => setValue("numOfBaby", v, { shouldValidate: true })}
          />
        </GuestStepperGroup>

        {errors.numOfAdults?.message ? (
          <p className="text-sm text-destructive">{errors.numOfAdults.message}</p>
        ) : null}

        {overCapacity ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Only {link.seatsLeft} seats are left on this cruise. Please reduce
            the number of guests.
          </p>
        ) : null}
      </section>

      {/* ---- 4. summary -------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="font-semibold">Payment summary</h2>

        <dl className="rounded-lg border bg-card p-4 text-sm tabular-nums">
          <div className="flex justify-between gap-3">
            <dt className="min-w-0 text-muted-foreground">
              Adults ({adults} × {formatPrice(link.adultPricePaise)})
            </dt>
            <dd className="whitespace-nowrap">{formatPrice(quote.adultSubtotalPaise)}</dd>
          </div>
          <div className="mt-1 flex justify-between gap-3">
            <dt className="min-w-0 text-muted-foreground">
              Children ({children} × {formatPrice(link.childPricePaise)})
            </dt>
            <dd className="whitespace-nowrap">{formatPrice(quote.childSubtotalPaise)}</dd>
          </div>
          <div className="mt-1 flex justify-between gap-3">
            <dt className="min-w-0 text-muted-foreground">GST ({link.gstRate}%)</dt>
            <dd className="whitespace-nowrap">{formatPrice(quote.gstPaise)}</dd>
          </div>

          <div className="mt-3 flex justify-between gap-3 border-t pt-3 text-base font-semibold">
            <dt>Total amount</dt>
            <dd className="whitespace-nowrap">{formatPrice(quote.fullTotalPaise)}</dd>
          </div>

          {isAdvance ? (
            <>
              <div className="mt-2 flex justify-between gap-3 font-semibold text-primary">
                <dt>Payable now ({link.advancePercent}%)</dt>
                <dd className="whitespace-nowrap">{formatPrice(quote.payableNowPaise)}</dd>
              </div>
              <div className="mt-1 flex justify-between gap-3 text-muted-foreground">
                <dt>Balance on the day</dt>
                <dd className="whitespace-nowrap">{formatPrice(quote.balancePaise)}</dd>
              </div>
            </>
          ) : null}
        </dl>

        {isAdvance ? (
          <p className="flex items-start gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Pay {link.advancePercent}% now to confirm your seats. The remaining{" "}
            {formatPrice(quote.balancePaise)} is collected at boarding.
          </p>
        ) : null}
      </section>

      {/*
        Inline CTA for tablet and desktop. On phones this is replaced by the
        sticky bar below, so the button is never stranded under a long form —
        but the spacer keeps the last section clear of the fixed bar.
      */}
      <div className="hidden space-y-2 sm:block">
        <PayButton />
        <SecurityNote />
      </div>

      <div className="h-24 sm:hidden" aria-hidden />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        <div className="mx-auto w-full max-w-2xl space-y-1.5">
          <PayButton />
          <SecurityNote />
        </div>
      </div>
    </form>
  );

  function PayButton() {
    return (
      <Button
        type="submit"
        size="lg"
        className={cn("h-12 w-full text-base")}
        disabled={isPending || noGuests || overCapacity}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Lock className="mr-2 h-5 w-5" />
        )}
        {noGuests
          ? "Select at least one guest"
          : `Pay ${formatPrice(quote.payableNowPaise)}`}
      </Button>
    );
  }

  function SecurityNote() {
    return (
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secure payment via Razorpay — cards, UPI and netbanking
      </p>
    );
  }
}
