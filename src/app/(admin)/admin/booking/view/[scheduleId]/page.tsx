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

  return (
    <div className="">
      <h2 className="font-bold text-3xl text-center py-5">Booking data</h2>
      <div className="flex justify-between p-3">
        <div className="">
          <CustomLinkButton
            icon={<ArrowLeft size={20} />}
            href={`/admin/booking`}
            label="Back"
            className="flex gap-2 justify-between"
          />
        </div>
        <div className="flex gap-5">
          <MoveAllBookingsButton
            disabled={!bookings?.length ? true : false}
            scheduleId={scheduleId}
            className=""
          />
          <CustomLinkButton
            href={`/admin/booking/add/${scheduleId}`}
            label="Add Booking"
            className=""
          />
          <RouterRefreshButton />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="text-center">Id</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Date of Booking</TableHead>
            <TableHead className="text-center">Package</TableHead>
            <TableHead className="text-center">Advance Paid</TableHead>
            <TableHead className="text-center">Total Bill</TableHead>
            <TableHead className="text-center">Phone</TableHead>
            <TableHead className="text-center">Adults</TableHead>
            <TableHead className="text-center">Child</TableHead>
            <TableHead className="text-center">kids</TableHead>
            <TableHead className="text-center">Description</TableHead>
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
                    <TableCell className="">{i + 1}</TableCell>
                    <TableCell className="">{booking.user.name}</TableCell>
                    <TableCell className="">{formattedDate}</TableCell>
                    <TableCell>{booking.schedule.schedulePackage}</TableCell>
                    <TableCell className="">
                      {booking.payment.advancePaid}
                    </TableCell>
                    <TableCell className="">
                      {booking.payment.totalAmount}
                    </TableCell>
                    <TableCell className="">{booking.user.contact}</TableCell>
                    <TableCell className="">{booking.numOfAdults}</TableCell>
                    <TableCell className="">{booking.numOfChildren}</TableCell>
                    <TableCell className="">{booking.numOfBaby}</TableCell>
                    <TableCell className="">{booking.description}</TableCell>
                    <TableCell>
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
                    <TableCell></TableCell>
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
