"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { TSelectableSchedule } from "@/db/data/dto/bookingLink";
import { cn, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarRange, Check, Clock, Users } from "lucide-react";
import { useState } from "react";

/**
 * Pick an existing schedule rather than a bare date.
 *
 * The admin manages schedules elsewhere; making them choose one here means the
 * date and its package can never disagree, and they can see how many seats are
 * actually left before quoting a customer.
 */
export function SelectScheduleDialog({
  selected,
  onSelect,
  triggerLabel = "Choose schedule",
}: {
  selected?: TSelectableSchedule;
  onSelect: (schedule: TSelectableSchedule) => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.admin.bookingLink.getSelectableSchedules.useInfiniteQuery(
      { limit: 20 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: open,
      },
    );

  const schedules = data?.pages.flatMap((p) => p.schedules) ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={selected ? "outline" : "default"}>
          <CalendarRange className="mr-2 h-4 w-4" />
          {selected ? "Change" : triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-w-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Choose a schedule</DialogTitle>
          <DialogDescription>
            Upcoming cruises with seats available. Manage the list under
            Schedule &rarr; Manage schedules.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-2 max-h-[55vh] overflow-y-auto px-2">
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[74px] w-full rounded-lg" />
              ))}
            </div>
          ) : schedules.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No upcoming schedules with a package attached. Create one under
              Manage schedules first.
            </p>
          ) : (
            <ul className="space-y-2">
              {schedules.map((schedule) => {
                const isSelected = selected?.id === schedule.id;
                const soldOut = schedule.seatsLeft <= 0;

                return (
                  <li key={schedule.id}>
                    <button
                      type="button"
                      disabled={soldOut}
                      onClick={() => {
                        onSelect(schedule);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        soldOut
                          ? "cursor-not-allowed opacity-50"
                          : "hover:border-primary/60 hover:bg-accent",
                        isSelected && "border-primary bg-accent",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {schedule.Package?.title ?? "Untitled package"}
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarRange className="h-3.5 w-3.5" />
                              {format(new Date(schedule.day), "EEE dd MMM yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {schedule.fromTime ??
                                schedule.Package?.fromTime ??
                                "--"}{" "}
                              &ndash;{" "}
                              {schedule.toTime ??
                                schedule.Package?.toTime ??
                                "--"}
                            </span>
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          {isSelected ? (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                          ) : null}
                          <p className="text-sm font-medium tabular-nums">
                            {formatPrice(schedule.Package?.adultPrice ?? 0)}
                          </p>
                          <p
                            className={cn(
                              "flex items-center justify-end gap-1 text-xs",
                              soldOut
                                ? "text-destructive"
                                : "text-muted-foreground",
                            )}
                          >
                            <Users className="h-3 w-3" />
                            {soldOut ? "Full" : `${schedule.seatsLeft} left`}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {hasNextPage ? (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? "Loading…" : "Load more"}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
