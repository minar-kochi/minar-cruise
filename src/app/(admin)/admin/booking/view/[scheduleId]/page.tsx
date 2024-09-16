import {
  getBookingsByScheduleId,
  TGetBookingsByScheduleId,
} from "@/db/data/dto/schedule";
// import { Componentssdas } from "./Components";
import DropMenuClient from "./DropMenuContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, EllipsisVertical } from "lucide-react";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";
import CustomLinkButton from "@/components/custom/CustomLinkButton";
import MoveAllBookingsButton from "@/components/admin/booking/MoveAllBookingsButton";
import { booking } from "@/server/routers/admin/booking";
import DownloadBookingButton from "@/components/excel/DownloadBookingButton";

interface IViewBooking {
  params: {
    scheduleId: string;
  };
  searchParams: {
    [key in string]: string;
  };
}

export default async function ViewBooking({
  params: { scheduleId },
  searchParams,
}: IViewBooking) {
  const bookings: TGetBookingsByScheduleId =
    await getBookingsByScheduleId(scheduleId);
  if (!booking) return null;
  return (
    <div className="">
      <h2 className="font-bold text-3xl text-center py-5">Booking data</h2>
      <div className="flex max-sm:flex-col max-sm:gap-3 justify-between p-3">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center justify-center">
            <CustomLinkButton
              icon={<ChevronLeft size={20} />}
              href={`/admin/booking`}
              label="Back"
              props={{
                variant: "secondary"
              }}
              className="flex pl-2 justify-between"
            />
            <DownloadBookingButton tableData={bookings} />
          </div>
        </div>
        <div className="flex flex-wrap max-sm:justify-between max-sm:w-full sm:gap-5">
          <RouterRefreshButton className="border" />
          <MoveAllBookingsButton
            disabled={!bookings?.length ? true : false}
            scheduleId={scheduleId}
            className="max-sm:order-first"
          />
          <CustomLinkButton
            href={`/admin/booking/add/${scheduleId}`}
            label="Add Booking"
            className="min-w-[140px] text-white"
            props={{
              variant: "greenFlag",
            }}
          />
        </div>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:p-2">
              Id
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty ">
              Name
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:p-0">
              Date of Booking
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:p-2">
              Package
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Advance Paid
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Total Bill
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty">
              Phone
            </TableHead>
            <TableHead className="hidden max-sm:flex items-center align-bottom border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty">
              Count
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Adults
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Child
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              kids
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Description
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings && bookings.length > 0
            ? bookings.map((booking, i) => {
                const formattedDate = format(booking.createdAt, "P");
                return (
                  <TableRow
                    key={`aa-${booking.id}-view-booking-table-row-${i}`}
                    className="text-center cursor-pointer"
                  >
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0">
                      {i + 1}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:text-nowrap">
                      {booking.user.name}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-2">
                      {formattedDate}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0">
                      {booking.schedule.schedulePackage}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.payment.advancePaid}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:hidden">
                      {booking.payment.totalAmount}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0">
                      {booking.user.contact}
                    </TableCell>
                    <TableCell className="hidden border-r max-sm:text-[9px] max-sm:block">
                      {booking.numOfAdults +
                        booking.numOfChildren +
                        booking.numOfBaby}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.numOfAdults}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.numOfChildren}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.numOfBaby}
                    </TableCell>
                    <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.description}
                    </TableCell>
                    <TableCell className="max-sm:p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropMenuClient
                          BookingId={booking.id}
                          scheduleId={scheduleId}
                        />
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
      <div className="py-5 font-bold">
        {!bookings?.length ? (
          <p className="max-w-max mx-auto">Booking Empty</p>
        ) : null}
      </div>
    </div>
  );
}

{
  /* <AlertDialog>
  <AlertDialogTrigger>Update</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>You are going to update </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>; */
}
