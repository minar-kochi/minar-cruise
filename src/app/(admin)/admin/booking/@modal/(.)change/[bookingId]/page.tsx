"use client";

import React, { useState } from "react";
import { Modal } from "./modal";
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

export default function ChangeBookingModal({
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
      onError() {
        toast.dismiss();
        toast.error(`something went wrong`);
      },
    });

  const onSubmit = ({ scheduleId: toScheduleId }: { scheduleId: string }) => {
    mutateScheduleIdOfBooking({
      idOfBookingToBeUpdated: bookingId,
      toScheduleId: toScheduleId,
    });
  };

  return (
    <Modal className="sm:min-w-[600px]">
      <div className="flex flex-col p-5 gap-9">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold ">
            Select a schedule that you want to change
          </h1>
          <p className="text-sm text-muted-foreground">
            Proceed with caution, make sure client is aware of the changes that
            you are going to make
          </p>
        </div>
        <form
          className="md:flex flex flex-col gap-5 justify-between"
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
                <SelectTrigger className=" ">
                  <SelectValue placeholder="Select a Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map((item, i) => {
                      return (
                        <SelectItem
                          key={item.label + item.value + i}
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
    </Modal>
  );
}
