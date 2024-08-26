"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ScheduleDatePicker from "../dashboard/Schedule/ScheduleDatePicker";
import { SelectForm } from "@/components/custom/CustomSelectBox";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { scheduleIdAndPackageTitleSelector } from "@/lib/features/schedule/selector";
import { useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { cn, sleep } from "@/lib/utils";
import {
  moveAllBookingsSchema,
  TMoveAllBookingsSchema,
} from "@/lib/validators/Booking";
import { ZodError } from "zod";

interface IMoveAllBookingsButton {
  disabled?: boolean;
  scheduleId: string;
  className?: string;
}

export default function MoveAllBookingsButton({
  disabled,
  scheduleId,
  className,
}: IMoveAllBookingsButton) {
  const router = useRouter();
  const [changeToScheduleId, setChangeToScheduleId] = useState("");
  const schedulesData = useAppSelector((state) =>
    scheduleIdAndPackageTitleSelector(state),
  );

  const { mutate, isPending } =
    trpc.admin.booking.transferAllBookingsToASpecificSchedule.useMutation({
      onMutate() {
        toast.loading(`Moving All Bookings`);
      },
      async onSuccess() {
        await sleep(2000);
        toast.dismiss();
        toast.success("Migration Successful");
        router.push(`/admin/booking`);
      },
      onError(error) {
        toast.dismiss();
        toast.error(error.message);
      },
    });

  function handleClick() {
    try {
      const unSafeData = {
        fromScheduleId: scheduleId,
        toScheduleId: changeToScheduleId,
      };

      if (changeToScheduleId === "") {
        toast.error("Please select a Package to continue");
        return;
      }

      const { fromScheduleId, toScheduleId } =
        moveAllBookingsSchema.parse(unSafeData);

      mutate({
        fromScheduleId,
        toScheduleId,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
      toast.error("Something went wrong.");
    }
  }
  return (
    <Dialog>
      <DialogTrigger disabled={disabled} asChild className={cn("", className)}>
        <Button variant="destructive">Move all bookings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Are you sure you want to change all bookings ?
          </DialogTitle>
          <DialogDescription>
            Make sure you made sure every customers in this schedule are aware
            of the changes that you are going to commit
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="name" className="text-right">
              Date
            </Label>
            <div className="col-span-3 ">
              <ScheduleDatePicker className="" />
            </div>
          </div>
          <form className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Schedule
            </Label>
            <Select onValueChange={setChangeToScheduleId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available packages</SelectLabel>
                  {schedulesData.map((item, i) => {
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
          </form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleClick}
            disabled={isPending}
            variant={"destructiveOutline"}
          >
            Confirm changes
          </Button>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <Dialog>
<DialogTrigger disabled={disabled} asChild className={cn("", className)}>
  <Button variant="destructive">Move all bookings </Button>
</DialogTrigger>
<DialogContent className="">
  <DialogHeader className="space-y-3">
    <DialogTitle className="text-red-700 text-xl text-left text-wrap">
      Are you sure you want to change all bookings ?
    </DialogTitle>
    <DialogDescription>
      Make sure you made sure every customers in this schedule are aware
      of the changes that you are going to commit
    </DialogDescription>
  </DialogHeader>
  <div className="grid gap-4 py-4 ">
    <div className="flex justify-between items-center gap-4 ">
      <Label htmlFor="name" className="">
        Date
      </Label>
      <div className="min-w-[350px]">
        <ScheduleDatePicker className="" />
      </div>
    </div>
    <form className="flex justify-between items-center gap-4">
      <Label htmlFor="schedule" className="">
        Schedule
      </Label>
      <Select onValueChange={setChangeToScheduleId}>
        <SelectTrigger className="w-[350px]">
          <SelectValue placeholder="Select package" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available packages</SelectLabel>
            {schedulesData.map((item, i) => {
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
    </form>
  </div>
  <DialogFooter>
    <Button type="submit" onClick={handleClick} disabled={isPending}>
      Confirm changes
    </Button>
  </DialogFooter>
</DialogContent>
</Dialog> */
}
