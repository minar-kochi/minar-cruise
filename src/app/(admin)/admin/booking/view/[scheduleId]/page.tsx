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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";
import CustomLinkButton from "@/components/custom/CustomLinkButton";
import { Modal } from "../../@modal/(.)change/[bookingId]/modal";
import { Dialog } from "@/components/ui/dialog";
import MoveAllSchedulesButton from "@/components/admin/booking/MoveAllBookingsButton";
import MoveAllBookingsButton from "@/components/admin/booking/MoveAllBookingsButton";
import { booking } from "@/server/routers/admin/booking";
import DownloadTable from "@/components/admin/booking/DownloadBookingTable";
import DownloadBookingTable from "@/components/admin/booking/DownloadBookingTable";

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
  if(!booking) return null
  return (
    <div className="">
      <h2 className="font-bold text-3xl text-center py-5">Booking data</h2>
      <div className="flex justify-between p-3">
        <div className="">
          <CustomLinkButton
            icon={<ArrowLeft size={20} />}
            href={`/admin/booking`}
            label="Back"
            className="flex gap-2 justify-between max-md:hidden"
          />
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
            className="min-w-[140px]"
            props={{
              variant: "greenFlag",
            }}
          />
          <DownloadBookingTable tableData={bookings}/>
        </div>
      </div>
      <Table className="border-2">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:p-2">
              Id
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty ">
              Name
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:p-0">
              Date of Booking
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:p-2">
              Package
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Advance Paid
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Total Bill
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty">
              Phone
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:block hidden">
              Count
            </TableHead>

            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Adults
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Child
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              kids
            </TableHead>
            <TableHead className="text-center max-sm:text-[9px] max-sm:font-bold max-sm:text-pretty max-sm:hidden">
              Description
            </TableHead>
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
                    <TableCell className="max-sm:text-[9px] max-sm:p-0">
                      {i + 1}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:text-nowrap">
                      {booking.user.name}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-2">
                      {formattedDate}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0">
                      {booking.schedule.schedulePackage}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.payment.advancePaid}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:hidden">
                      {booking.payment.totalAmount}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0">
                      {booking.user.contact}
                    </TableCell>
                    <TableCell className="hidden max-sm:text-[9px] max-sm:block">
                      {booking.numOfAdults +
                        booking.numOfChildren +
                        booking.numOfBaby}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.numOfAdults}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.numOfChildren}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                      {booking.numOfBaby}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
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
