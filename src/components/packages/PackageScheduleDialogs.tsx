import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { format } from "date-fns";
import { Button, buttonVariants } from "../ui/button";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import Link from "next/link";
import { cn } from "@/lib/utils";
// import { Dispatch } from "redux";
export type TPackageScheduleDialogs = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  selectedDate: Date;
  isNextSlideState?: Dispatch<SetStateAction<boolean>>;
  ScheduleError: ScheduleConflictError | null;
};
export default function PackageScheduleDialogs({
  isOpen,
  setIsOpen,
  ScheduleError,
  selectedDate,
  isNextSlideState,
}: TPackageScheduleDialogs) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger>OpenTHis</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Another Package found at same Date and time</DialogTitle>
          <DialogDescription>
            There is an another package scheduled at{" "}
            <span className="text-black font-medium">
              {format(selectedDate, "EEEE dd/MM/yyyy")}
            </span>
            , Please select another date, or you can book the scheduled package{" "}
            {ScheduleError ? (
              <span className="text-black font-medium">
                {ScheduleError.title}
              </span>
            ) : (
              ""
            )}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex gap-2">
            {ScheduleError ? (
              <>
                {ScheduleError.slug ? (
                  <Link
                    className={cn(buttonVariants({ variant: "default" }))}
                    href={`/package/${ScheduleError.slug}`}
                  >
                    Book now
                  </Link>
                ) : null}
              </>
            ) : null}
            <Button
              variant={"ghost"}
              onClick={() => {
                // isNextSlideState(false);
                setIsOpen(false);
              }}
            >
              select Diffrent Date
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
