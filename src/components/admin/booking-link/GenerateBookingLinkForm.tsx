"use client";

import { trpc } from "@/app/_trpc/client";
import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Button } from "@/components/ui/button";
import type { TSelectableSchedule } from "@/db/data/dto/bookingLink";
import { computeBookingLinkQuote } from "@/lib/helpers/bookingLink/quote";
import { formatPrice } from "@/lib/utils";
import {
  generateBookingLinkSchema,
  TGenerateBookingLink,
} from "@/lib/validators/bookingLink";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { format } from "date-fns";
import {
  CalendarRange,
  Clock,
  Info,
  Link2,
  Loader2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GeneratedLinkPanel } from "./GeneratedLinkPanel";
import {
  GuestStepper,
  GuestStepperGroup,
} from "@/components/booking-link/GuestStepper";
import { PaymentTypeRadio } from "./PaymentTypeRadio";
import { SelectScheduleDialog } from "./SelectScheduleDialog";

type TGenerated = {
  url: string;
  packageTitle: string;
  cruiseDate: string;
  expiresAt: string;
  clampedToDeparture: boolean;
  prefillPhone?: string | null;
  prefillEmail?: string | null;
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  );
}

export default function GenerateBookingLinkForm() {
  const [generated, setGenerated] = useState<TGenerated | null>(null);
  const [schedule, setSchedule] = useState<TSelectableSchedule>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TGenerateBookingLink>({
    resolver: zodResolver(generateBookingLinkSchema),
    defaultValues: {
      scheduleId: "",
      paymentType: "ADVANCE",
      prefillName: "",
      prefillEmail: "",
      prefillPhone: "",
      prefillAdultCount: 0,
      prefillChildCount: 0,
      prefillBabyCount: 0,
      expiryHours: 72,
      allowBelowMinimum: true,
      adminNote: "",
    },
  });

  const utils = trpc.useUtils();
  const { mutate: generate, isPending } =
    trpc.admin.bookingLink.generate.useMutation({
      onSuccess(res) {
        utils.admin.bookingLink.list.invalidate();
        setGenerated({
          url: res.url,
          packageTitle: schedule?.Package?.title ?? "your cruise",
          cruiseDate: schedule
            ? format(new Date(schedule.day), "EEE dd MMM yyyy")
            : "",
          expiresAt: format(new Date(res.link.expiresAt), "dd MMM yyyy, h:mm a"),
          clampedToDeparture: res.clampedToDeparture,
          prefillPhone: res.link.prefillPhone,
          prefillEmail: res.link.prefillEmail,
        });
        toast.success("Booking link ready to share");
      },
      onError(error) {
        toast.error(
          error instanceof TRPCClientError
            ? error.message
            : "Could not generate the link, please try again",
          { duration: 6000 },
        );
      },
    });

  const paymentType = watch("paymentType");
  const adults = watch("prefillAdultCount");
  const children = watch("prefillChildCount");
  const babies = watch("prefillBabyCount");

  const { data: taxConfig } = trpc.admin.taxConfig.getPublicTaxConfig.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 },
  );
  const gstRate = taxConfig?.gstRate ?? 5;

  /**
   * Preview only, so the admin can read the amount back on the call. The
   * authoritative figures come from the price snapshot server-side when the
   * customer opens the link.
   */
  const quote =
    schedule?.Package && adults + children > 0
      ? computeBookingLinkQuote({
          adultPricePaise: schedule.Package.adultPrice,
          childPricePaise: schedule.Package.childPrice,
          gstRate,
          adultCount: adults,
          childCount: children,
          paymentType,
        })
      : null;

  const overCapacity = schedule
    ? adults + children + babies > schedule.seatsLeft
    : false;

  if (generated) {
    return (
      <GeneratedLinkPanel
        {...generated}
        onCreateAnother={() => {
          reset();
          setSchedule(undefined);
          setGenerated(null);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(
        (data) => generate(data),
        /**
         * Without this, a validation failure on any field that has no error UI
         * — the guest counts, expiryHours, allowBelowMinimum, adminNote —
         * silently does nothing when the button is pressed, with no network
         * request and no feedback. Surface it instead.
         */
        (formErrors: FieldErrors<TGenerateBookingLink>) => {
          console.warn("[booking-link] form validation failed", formErrors);
          const firstMessage = Object.values(formErrors).find(
            (e): e is FieldError => typeof e?.message === "string",
          )?.message;

          toast.error(
            firstMessage ?? "Please check the highlighted fields and try again.",
            { duration: 5000 },
          );
        },
      )}
      className="space-y-8"
    >
      {/* ---- schedule --------------------------------------------------- */}
      <section className="space-y-3">
        <SectionHeading>Schedule</SectionHeading>

        {schedule ? (
          <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <p className="font-semibold">{schedule.Package?.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarRange className="h-4 w-4" />
                  {format(new Date(schedule.day), "EEE dd MMM yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {schedule.fromTime ?? schedule.Package?.fromTime} &ndash;{" "}
                  {schedule.toTime ?? schedule.Package?.toTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {schedule.seatsLeft} of {schedule.seatsLeft + schedule.seatsBooked}{" "}
                  seats left
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {formatPrice(schedule.Package?.adultPrice ?? 0)} per adult ·{" "}
                {formatPrice(schedule.Package?.childPrice ?? 0)} per child
              </p>
            </div>

            <SelectScheduleDialog
              selected={schedule}
              onSelect={(s) => {
                setSchedule(s);
                setValue("scheduleId", s.id, { shouldValidate: true });
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
            <CalendarRange className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Pick a date</p>
              <p className="text-sm text-muted-foreground">
                Choose one of your scheduled cruises — the package and price
                come with it.
              </p>
            </div>
            <SelectScheduleDialog
              selected={schedule}
              triggerLabel="Pick a date"
              onSelect={(s) => {
                setSchedule(s);
                setValue("scheduleId", s.id, { shouldValidate: true });
              }}
            />
          </div>
        )}

        {errors.scheduleId?.message ? (
          <p className="text-sm text-destructive">{errors.scheduleId.message}</p>
        ) : null}
      </section>

      {/* ---- optional customer details ---------------------------------- */}
      <section className="space-y-3">
        <SectionHeading>
          Customer details{" "}
          <span className="font-normal normal-case">(optional)</span>
        </SectionHeading>

        <div className="grid gap-3 sm:grid-cols-3">
          <InputLabel
            label="Full name"
            errorMessage={errors.prefillName?.message}
            InputProps={{
              placeholder: "Full name",
              ...register("prefillName"),
            }}
          />
          <InputLabel
            label="Email"
            errorMessage={errors.prefillEmail?.message}
            InputProps={{
              placeholder: "Email address",
              type: "email",
              ...register("prefillEmail"),
            }}
          />
          <InputLabel
            label="Phone"
            errorMessage={errors.prefillPhone?.message}
            InputProps={{
              placeholder: "Phone number",
              ...register("prefillPhone"),
            }}
          />
        </div>

        <p className="flex items-start gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Anything you fill in is pre-filled for the customer, who can still
          change it. Leave it blank to share a bare link.
        </p>
      </section>

      {/* ---- optional guest counts -------------------------------------- */}
      <section className="space-y-3">
        <SectionHeading>
          Guests <span className="font-normal normal-case">(optional)</span>
        </SectionHeading>

        <GuestStepperGroup>
          <GuestStepper
            label="Adults"
            hint="12+ years"
            value={adults}
            max={150}
            onChange={(v) => setValue("prefillAdultCount", v)}
          />
          <GuestStepper
            label="Children"
            hint="5–12 years"
            value={children}
            max={120}
            onChange={(v) => setValue("prefillChildCount", v)}
          />
          <GuestStepper
            label="Infants"
            hint="Under 5 · not charged"
            value={babies}
            max={50}
            onChange={(v) => setValue("prefillBabyCount", v)}
          />
        </GuestStepperGroup>

        {/* These had no error UI, so a failure here used to be invisible. */}
        {(
          [
            "prefillAdultCount",
            "prefillChildCount",
            "prefillBabyCount",
          ] as const
        ).map((field) =>
          errors[field]?.message ? (
            <p key={field} className="text-sm text-destructive">
              {errors[field]?.message}
            </p>
          ) : null,
        )}

        {overCapacity ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            That is more guests than this schedule has seats for (
            {schedule?.seatsLeft} left). The customer can still change the
            counts, but the payment will be rejected if it exceeds capacity.
          </p>
        ) : null}
      </section>

      {/* ---- payment type ------------------------------------------------ */}
      <section className="space-y-3">
        <SectionHeading>Payment type</SectionHeading>

        <PaymentTypeRadio
          name="paymentType"
          value={paymentType}
          onChange={(v) => setValue("paymentType", v, { shouldValidate: true })}
          options={[
            {
              value: "ADVANCE",
              title: "Advance 50%",
              badge: "Recommended",
              description:
                "Customer pays half now, the rest is collected on the day.",
            },
            {
              value: "FULL",
              title: "Full payment",
              description: "Customer pays the whole amount when booking.",
            },
          ]}
        />
        {errors.paymentType?.message ? (
          <p className="text-sm text-destructive">
            {errors.paymentType.message}
          </p>
        ) : null}

        {quote ? (
          <dl className="rounded-lg border bg-muted/40 p-4 text-sm tabular-nums">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Base fare</dt>
              <dd>{formatPrice(quote.basePaise)}</dd>
            </div>
            <div className="mt-1 flex justify-between">
              <dt className="text-muted-foreground">GST ({gstRate}%)</dt>
              <dd>{formatPrice(quote.gstPaise)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(quote.fullTotalPaise)}</dd>
            </div>
            {quote.balancePaise > 0 ? (
              <>
                <div className="mt-1 flex justify-between font-semibold text-primary">
                  <dt>Payable now (50%)</dt>
                  <dd>{formatPrice(quote.payableNowPaise)}</dd>
                </div>
                <div className="mt-1 flex justify-between text-muted-foreground">
                  <dt>Balance at boarding</dt>
                  <dd>{formatPrice(quote.balancePaise)}</dd>
                </div>
              </>
            ) : null}
            <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">
              Preview for the guest counts above. The customer can change them
              and the amount recalculates.
            </p>
          </dl>
        ) : null}
      </section>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Link2 className="mr-2 h-5 w-5" />
        )}
        Generate booking link
      </Button>
    </form>
  );
}
