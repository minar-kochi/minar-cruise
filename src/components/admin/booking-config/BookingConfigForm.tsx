"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  BookingConfigValidator,
  TBookingConfigValidator,
} from "@/lib/validators/BookingConfigValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function BookingConfigForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } =
    trpc.admin.bookingConfig.getBookingConfig.useQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TBookingConfigValidator>({
    resolver: zodResolver(BookingConfigValidator),
    defaultValues: {
      maxBoatSeat: 150,
      defaultMinLeadTimeHours: 2,
      defaultMinNewBookingCount: 30,
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      maxBoatSeat: data.maxBoatSeat,
      defaultMinLeadTimeHours: data.defaultMinLeadTimeHours,
      defaultMinNewBookingCount: data.defaultMinNewBookingCount,
    });
  }, [data, reset]);

  const { mutate: updateBookingConfig, isPending } =
    trpc.admin.bookingConfig.updateBookingConfig.useMutation({
      onMutate() {
        toast.loading("Updating booking rules");
      },
      onError(error) {
        toast.dismiss();
        toast.error(error.message, { duration: 6000 });
      },
      async onSuccess() {
        toast.dismiss();
        toast.success("Booking rules updated — public pages revalidated");
        await utils.admin.bookingConfig.getBookingConfig.invalidate();
      },
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <form
      className="mx-auto max-w-3xl space-y-6"
      onSubmit={handleSubmit(
        (values) => updateBookingConfig(values),
        (formErrors: FieldErrors<TBookingConfigValidator>) => {
          console.warn("[booking-config] validation failed", formErrors);
          toast.error(
            "Please check the highlighted fields and try again.",
            { duration: 5000 },
          );
        },
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Boat &amp; booking limits</CardTitle>
          <CardDescription>
            The defaults every package inherits. Per-package cut-offs live on
            each package&rsquo;s Settings tab. Existing bookings are unaffected.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="maxBoatSeat">Boat capacity (seats)</Label>
            <Input
              id="maxBoatSeat"
              type="number"
              className="mt-1.5"
              {...register("maxBoatSeat", { valueAsNumber: true })}
            />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.maxBoatSeat,
              })}
            >
              {errors.maxBoatSeat?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="defaultMinLeadTimeHours">
              Default booking closes (hours before)
            </Label>
            <Input
              id="defaultMinLeadTimeHours"
              type="number"
              step="0.5"
              className="mt-1.5"
              {...register("defaultMinLeadTimeHours", { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Used by any package that has not set its own.
            </p>
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.defaultMinLeadTimeHours,
              })}
            >
              {errors.defaultMinLeadTimeHours?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="defaultMinNewBookingCount">
              Default minimum guests
            </Label>
            <Input
              id="defaultMinNewBookingCount"
              type="number"
              className="mt-1.5"
              {...register("defaultMinNewBookingCount", {
                valueAsNumber: true,
              })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Used by any package that has not set its own.
            </p>
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.defaultMinNewBookingCount,
              })}
            >
              {errors.defaultMinNewBookingCount?.message}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving
          </>
        ) : (
          "Save defaults"
        )}
      </Button>
    </form>
  );
}
