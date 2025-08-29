"use client";

import React, { useState } from "react";
import ScheduleDatePicker from "@/components/admin/dashboard/Schedule/ScheduleDatePicker";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import {
  TUpdateScheduleIdOfBooking,
  updateScheduleIdOfBooking,
} from "@/lib/validators/Booking";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scheduleIdAndPackageTitleSelector } from "@/lib/features/schedule/selector";
import { revalidatePath } from "next/cache";

export default function ChangeBooking({
  params: { bookingId },
  searchParams: { scheduleId },
}: {
  params: {
    bookingId: string;
  };
  searchParams: {
    scheduleId: string;
  };
}) {
  const router = useRouter();
  const { handleSubmit, control } = useForm({
    defaultValues: {
      scheduleId: "",
    },
  });

  const options = useAppSelector((state) =>
    scheduleIdAndPackageTitleSelector(state),
  );

  const { mutate: mutateScheduleIdOfBooking, isPending } =
    trpc.admin.booking.changeBookingSchedule.useMutation({
      onMutate() {
        toast.loading(`Changing Booking to new date`);
      },
      onSuccess() {
        toast.dismiss();
        toast.success(`successfully changed Booking to new date`);
        router.back();
      },
      onError(error, variables, context) {
        toast.dismiss();
        toast.error(error.message);
      },
    });

  const onSubmit = ({ scheduleId: toScheduleId }: { scheduleId: string }) => {
    if (scheduleId === "") {
      toast.error("select a package");
    }
    mutateScheduleIdOfBooking({
      idOfBookingToBeUpdated: bookingId,
      toScheduleId: toScheduleId,
    });
  };

  return (
    <div className="flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold text-wrap">
        Select a schedule that you want to change
      </h1>

      <form
        className="flex max-sm:flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="min-w-[200px]">
          <ScheduleDatePicker className="" />
        </div>

        <Controller
          name="scheduleId"
          control={control}
          rules={{ required: "Please select a schedule" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px] max-sm:w-full">
                <SelectValue placeholder="Select a Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((item, i) => {
                    return (
                      <SelectItem
                        key={`${item.label}-${item.value}-${i}-change-booking`}
                        value={item.value}
                        disabled={item.value === scheduleId}
                      >
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

        <Button type="submit" disabled={isPending} variant={"destructive"}>
          {isPending ? <Loader2 /> : "Change"}
        </Button>
      </form>
    </div>
  );
}
