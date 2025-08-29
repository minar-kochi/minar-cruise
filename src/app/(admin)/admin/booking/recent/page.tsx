"use client";
import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VIEW_BEFORE_PX } from "@/constants/config";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import {
  EllipsisVertical,
  Eye,
  Mail,
  Search,
  Calendar,
  Phone,
  User,
  Package,
  Clock,
  IndianRupee,
  Users,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

// Loading skeleton components
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell className="text-center">
      <Skeleton className="h-4 w-8 mx-auto" />
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48 hidden sm:block" />
      </div>
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-4 w-20 mx-auto" />
    </TableCell>
    <TableCell className="text-center hidden sm:table-cell">
      <Skeleton className="h-6 w-24 mx-auto" />
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-4 w-24 mx-auto" />
    </TableCell>
    <TableCell className="text-center hidden lg:table-cell">
      <Skeleton className="h-4 w-32 mx-auto" />
    </TableCell>
    <TableCell className="text-center hidden lg:table-cell">
      <Skeleton className="h-4 w-16 mx-auto" />
    </TableCell>
    <TableCell className="text-center hidden lg:table-cell">
      <Skeleton className="h-4 w-20 mx-auto" />
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-4 w-24 mx-auto" />
    </TableCell>
    <TableCell className="text-center hidden lg:table-cell">
      <Skeleton className="h-6 w-16 mx-auto" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-8" />
    </TableCell>
  </TableRow>
);

const MobileBookingCard = ({
  booking,
  index,
  pageNum,
  onResendEmail,
  onViewBooking,
}: any) => {
  const formattedDate = format(
    new Date(booking.createdAt ?? Date.now()),
    "dd/MM/yyyy",
  );
  const totalCount =
    booking.numOfAdults + booking.numOfChildren + booking.numOfBaby;

  const { fromTime, toTime } = selectFromTimeAndToTimeFromScheduleOrPackages({
    Packages: {
      packageFromTime: booking.schedule.Package?.fromTime ?? "",
      packageToTime: booking.schedule.Package?.toTime ?? "",
    },
    schedule: {
      scheduleFromTime: booking.schedule.fromTime,
      scheduleToTime: booking.schedule.toTime,
    },
  });

  const timeSlot = `${fromTime} - ${toTime}`;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            {booking.user.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            #{(pageNum + 1) * (index + 1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">
              {booking.user.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{booking.user.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {totalCount} guests
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium text-sm">
            {booking.schedule.Package?.title || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{timeSlot}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">
                ₹{booking.payment.advancePaid.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">advance</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-green-600">
                ₹{booking.payment.totalAmount.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">total</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <EllipsisVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onResendEmail(booking.id)}
                className="cursor-pointer"
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onViewBooking(booking.scheduleId)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Badge
          variant={
            booking.payment.modeOfPayment === "ONLINE" ? "default" : "secondary"
          }
          className="text-xs w-fit"
        >
          {booking.payment.modeOfPayment}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default function RecentBookingsPage() {
  const [input, setInputText] = useState("");
  const debouncedSearch = useDebounce(input, 500); // Debounce search input

  const {
    data: bookings,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = trpc.admin.booking.getRecentBookingsInfinity.useInfiniteQuery(
    {
      limit: 40,
      search: debouncedSearch,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  const router = useRouter();
  const { mutate: resendEmailMutation, isPending: isResendingEmail } =
    trpc.admin.booking.resendConfirmationEmail.useMutation({
      onSuccess(data, variables, context) {
        if (data.isAdminFailed) {
          toast.error("Failed to send email to admin, but was sent user.");
        } else {
          toast.success("Email sent successfully!");
        }
      },
      onError(error, variables, context) {
        if (error instanceof TRPCError) {
          toast.error(error.message);
          return;
        }
        toast.error("Failed to send email. Please try again.");
      },
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const resendEmail = (bookingId: string) => {
    if (isResendingEmail) return;

    const loadingToast = toast.loading("Sending email...");
    resendEmailMutation(
      { bookingId },
      {
        onSettled: () => {
          toast.dismiss(loadingToast);
        },
      },
    );
  };

  const viewBooking = (scheduleId: string) => {
    router.push(`/admin/booking/view/${scheduleId}`);
  };

  const totalBookings = useMemo(() => {
    if (!bookings?.pages) return 0;
    return bookings.pages.reduce(
      (total, page) => total + page.response.length,
      0,
    );
  }, [bookings]);

  const isSearching = input !== debouncedSearch;

  return (
    <div className=" mx-auto py-6 px-4 ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your recent booking requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                value={input}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Search by booking id, name, email, or phone number..."
                className="pl-10 pr-4"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead className="min-w-[200px]">Customer</TableHead>
                    <TableHead className="text-center">Booking Date</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">
                      Event Date
                    </TableHead>
                    <TableHead className="text-center">Package</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">
                      Time Slot
                    </TableHead>
                    <TableHead className="text-center hidden lg:table-cell">
                      Advance
                    </TableHead>
                    <TableHead className="text-center hidden lg:table-cell">
                      Total
                    </TableHead>
                    <TableHead className="text-center">Contact</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">
                      Payment
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile loading skeleton */}
            <div className="md:hidden p-4 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : bookings &&
        bookings.pages.length > 0 &&
        bookings.pages[0].response.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-12 text-center font-semibold">
                        #
                      </TableHead>
                      <TableHead className="min-w-[200px] font-semibold">
                        Customer
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Booking Date
                      </TableHead>
                      <TableHead className="text-center font-semibold hidden sm:table-cell">
                        Event Date
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Package
                      </TableHead>
                      <TableHead className="text-center font-semibold hidden lg:table-cell">
                        Time Slot
                      </TableHead>
                      <TableHead className="text-center font-semibold hidden lg:table-cell">
                        Advance
                      </TableHead>
                      <TableHead className="text-center font-semibold hidden lg:table-cell">
                        Total
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Contact
                      </TableHead>
                      <TableHead className="text-center font-semibold hidden lg:table-cell">
                        Payment
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.pages.map((page, pageNum) =>
                      page.response.map((booking, index) => {
                        const formattedDate = format(
                          new Date(booking.createdAt ?? Date.now()),
                          "dd/MM/yyyy",
                        );
                        const totalCount =
                          booking.numOfAdults +
                          booking.numOfChildren +
                          booking.numOfBaby;

                        const { fromTime, toTime } =
                          selectFromTimeAndToTimeFromScheduleOrPackages({
                            Packages: {
                              packageFromTime:
                                booking.schedule.Package?.fromTime ?? "",
                              packageToTime:
                                booking.schedule.Package?.toTime ?? "",
                            },
                            schedule: {
                              scheduleFromTime: booking.schedule.fromTime,
                              scheduleToTime: booking.schedule.toTime,
                            },
                          });

                        const timeSlot = `${fromTime} - ${toTime}`;

                        return (
                          <TableRow
                            key={`booking-${booking.id}-${index}`}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="text-center font-medium">
                              {pageNum * 40 + index + 1}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {booking.user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {booking.user.email}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {formattedDate}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center hidden sm:table-cell">
                              <Badge
                                variant="secondary"
                                className="font-mono text-xs"
                              >
                                {format(
                                  new Date(booking.schedule.day ?? Date.now()),
                                  "dd/MM/yyyy",
                                )}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center">
                              <span className="font-medium">
                                {booking.schedule.Package?.title || "N/A"}
                              </span>
                            </TableCell>

                            <TableCell className="text-center hidden lg:table-cell">
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {timeSlot}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center hidden lg:table-cell">
                              <span className="font-medium text-orange-600">
                                ₹{booking.payment.advancePaid.toLocaleString()}
                              </span>
                            </TableCell>

                            <TableCell className="text-center hidden lg:table-cell">
                              <span className="font-medium text-green-600">
                                ₹{booking.payment.totalAmount.toLocaleString()}
                              </span>
                            </TableCell>

                            <TableCell className="text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-medium">
                                  {booking.user.contact}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {totalCount} guests
                                </Badge>
                              </div>
                            </TableCell>

                            <TableCell className="text-center hidden lg:table-cell">
                              <Badge
                                variant={
                                  booking.payment.modeOfPayment === "ONLINE"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {booking.payment.modeOfPayment}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                  >
                                    <EllipsisVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={() => resendEmail(booking.id)}
                                    className="cursor-pointer"
                                    disabled={isResendingEmail}
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      viewBooking(booking.scheduleId)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      }),
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {bookings.pages.map((page, pageNum) =>
              page.response.map((booking, index) => (
                <MobileBookingCard
                  key={`mobile-booking-${booking.id}-${index}`}
                  booking={booking}
                  index={index}
                  pageNum={pageNum}
                  onResendEmail={resendEmail}
                  onViewBooking={viewBooking}
                />
              )),
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              {input
                ? `No bookings match your search "${input}". Try adjusting your search terms.`
                : "No recent bookings to display. New bookings will appear here once created."}
            </p>
            {input && (
              <Button
                variant="outline"
                onClick={() => setInputText("")}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Infinite Scroll Trigger & Load More */}
      {bookings &&
        bookings.pages.length > 0 &&
        bookings.pages[0].response.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div ref={ref} className="w-full h-2" />
            {hasNextPage && (
              <div className="flex flex-col gap-2 items-center justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4" />
                      Load More Bookings
                    </>
                  )}
                </Button>
                {totalBookings > 0 && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {totalBookings} bookings
                  </Badge>
                )}
              </div>
            )}
            {!hasNextPage && totalBookings > 0 && (
              <div className="flex gap-2 flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the end of the list{" "}
                </p>
                {totalBookings > 0 && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {totalBookings} bookings
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

// Custom debounce hook (add this to your hooks folder)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
