"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";

interface IDeleteBookingButton {
  BookingId: string;
  ScheduleId: string;
}
export default function DeleteBookingButton({
  BookingId,
  ScheduleId,
}: IDeleteBookingButton) {
  const router = useRouter();
  const { invalidate: invalidateBookingSchedule } =
    trpc.useUtils().admin.booking.bookingScheduleInfinity;
  const {
    mutate: deleteBooking,
    isPending,
    error,
  } = trpc.admin.booking.deleteBooking.useMutation({
    onMutate() {
      toast.loading("Deleting booking");
    },
    onError() {
      toast.dismiss();
      toast.error("Delete failed");
    },
    async onSuccess() {
      toast.dismiss();
      toast.success("Booking deleted");
      await invalidateBookingSchedule(undefined, {
        type: "all",
      });

      router.refresh();
    },
  });
  function handleClick() {
    deleteBooking({ bookingId: BookingId });
    toast.success("success");
  }
  return (
    <Dialog>
      <DialogTrigger className="w-full my-1">
        <Button className="min-w-full" variant={"destructive"} size={"sm"}>
          Delete{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-700 text-xl">
            Are you sure you want to delete this booking?
          </DialogTitle>
          <DialogDescription>
            This is a non recoverable action, proceed with caution!!!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClick}>Confirm changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
