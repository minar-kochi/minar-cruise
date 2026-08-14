"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

/**
 * Guest counters, shared by the admin generate form and the customer checkout
 * so the two always behave identically.
 *
 * Rendered as one bordered group of divided rows rather than a grid of
 * individual cards: three bordered cards side by side left each one too narrow
 * for an icon, two lines of text and three controls, which read as clutter. A
 * single full-width list also needs no responsive variant — it is the same
 * shape on a phone and a desktop.
 */

export function GuestStepperGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("divide-y rounded-lg border", className)}>
      {children}
    </div>
  );
}

export function GuestStepper({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 150,
  disabled,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight sm:text-base">
          {label}
        </p>
        {hint ? (
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          // h-10/w-10 keeps the tap target at the 40px minimum on touch screens.
          className="h-10 w-10 rounded-full"
          aria-label={`Decrease ${label}`}
          disabled={atMin}
          onClick={() => onChange(clamp(value - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span
          className="w-9 text-center text-base font-semibold tabular-nums"
          aria-live="polite"
          aria-label={`${label}: ${value}`}
        >
          {value}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          aria-label={`Increase ${label}`}
          disabled={atMax}
          onClick={() => onChange(clamp(value + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
