"use client";

import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatPrice } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { format } from "date-fns";
import { Ban, Copy, ExternalLink, Link2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type TStatusFilter = "ALL" | $Enums.BOOKING_LINK_STATUS;

const FILTERS: TStatusFilter[] = [
  "ACTIVE",
  "PAID",
  "CANCELLED",
  "EXPIRED",
  "ALL",
];

/** Status is the one place a splash of colour genuinely helps scanning. */
function StatusBadge({
  status,
  expiresAt,
}: {
  status: $Enums.BOOKING_LINK_STATUS;
  expiresAt: string | Date;
}) {
  // Expiry is evaluated lazily, so an ACTIVE row can already be past its date.
  const lapsed =
    status === "ACTIVE" && new Date(expiresAt).getTime() <= Date.now();
  const effective = lapsed ? "EXPIRED" : status;

  const variant = {
    ACTIVE: "default",
    PAID: "secondary",
    CANCELLED: "outline",
    EXPIRED: "outline",
  }[effective] as "default" | "secondary" | "outline";

  return (
    <Badge
      variant={variant}
      className={cn(
        effective === "EXPIRED" && "text-muted-foreground",
        effective === "CANCELLED" && "text-destructive",
      )}
    >
      {effective.charAt(0) + effective.slice(1).toLowerCase()}
    </Badge>
  );
}

export default function BookingLinkTable() {
  const [status, setStatus] = useState<TStatusFilter>("ACTIVE");

  const utils = trpc.useUtils();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.admin.bookingLink.list.useInfiniteQuery(
      { limit: 20, status },
      { getNextPageParam: (last) => last.nextCursor },
    );

  const { mutate: cancel, isPending: isCancelling } =
    trpc.admin.bookingLink.cancel.useMutation({
      onSuccess() {
        utils.admin.bookingLink.list.invalidate();
        toast.success("Link cancelled");
      },
      onError(e) {
        toast.error(e.message, { duration: 6000 });
      },
    });

  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f}
              type="button"
              size="sm"
              variant={status === f ? "default" : "ghost"}
              onClick={() => setStatus(f)}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        <Button asChild size="sm">
          <Link href="/admin/booking-links/new">
            <Plus className="mr-1 h-4 w-4" />
            Generate link
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Link2 className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No booking links here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate one after a booking call and share it with the customer.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cruise</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">
                      {row.Package?.title ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(row.scheduleDay), "EEE dd MMM yyyy")}
                    </p>
                    {/* Stands in for the columns hidden at this width. */}
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {row.paymentType === "ADVANCE"
                        ? `Advance ${row.advancePercent}%`
                        : "Full"}
                      {row.quotedTotalPaise
                        ? ` · ${formatPrice(row.quotedTotalPaise)}`
                        : ""}
                    </p>
                    {row.prefillName || row.prefillPhone ? (
                      <p className="text-xs text-muted-foreground md:hidden">
                        {[row.prefillName, row.prefillPhone]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </TableCell>

                  <TableCell className="hidden text-sm md:table-cell">
                    {row.prefillName || row.prefillPhone ? (
                      <>
                        <p>{row.prefillName || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.prefillPhone || row.prefillEmail || ""}
                        </p>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>

                  <TableCell className="hidden text-sm sm:table-cell">
                    <p>
                      {row.paymentType === "ADVANCE"
                        ? `Advance ${row.advancePercent}%`
                        : "Full"}
                    </p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {row.quotedTotalPaise
                        ? formatPrice(row.quotedTotalPaise)
                        : "Not quoted yet"}
                    </p>
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={row.status}
                      expiresAt={row.expiresAt}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Copy link"
                        onClick={() => copy(row.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      {row.bookingId && row.scheduleId ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          title="View booking"
                        >
                          <Link href={`/admin/booking/view/${row.scheduleId}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : null}

                      {row.status === "ACTIVE" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Cancel link"
                          disabled={isCancelling}
                          onClick={() => cancel({ id: row.id })}
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  );
}
