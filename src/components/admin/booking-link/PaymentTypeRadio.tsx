"use client";

import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { Check } from "lucide-react";

/**
 * Two selectable cards for the payment split.
 *
 * Built on a native radio input rather than a Radix RadioGroup: this project
 * does not ship `@radix-ui/react-radio-group` and adding a dependency for two
 * options isn't worth it. `sr-only` inputs keep keyboard and screen-reader
 * behaviour intact and work directly with react-hook-form's `register`.
 */

export type TPaymentTypeOption = {
  value: $Enums.BOOKING_LINK_PAYMENT_TYPE;
  title: string;
  badge?: string;
  description: string;
};

export function PaymentTypeRadio({
  options,
  value,
  name,
  onChange,
  className,
}: {
  options: TPaymentTypeOption[];
  value: string | undefined;
  name: string;
  /**
   * Explicitly controlled rather than taking a `register()` spread. Mixing a
   * React-controlled `checked` with react-hook-form's ref-based radio
   * registration leaves it ambiguous who owns the value, and a group that ends
   * up reporting no checked ref submits `undefined` — which fails validation
   * with no visible error.
   */
  onChange: (value: $Enums.BOOKING_LINK_PAYMENT_TYPE) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Payment type"
      className={cn("grid gap-3 sm:grid-cols-2", className)}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "relative cursor-pointer rounded-lg border-2 p-4 transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              selected
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/40",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
            />

            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  selected ? "border-primary bg-primary" : "border-muted-foreground/40",
                )}
              >
                {selected ? (
                  <Check className="h-3 w-3 text-primary-foreground" />
                ) : null}
              </span>

              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold leading-tight">
                  {option.title}
                  {option.badge ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {option.badge}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
