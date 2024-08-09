import {
  getBookingsByScheduleId,
  TGetBookingsByScheduleId,
} from "@/db/data/dto/schedule";
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
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";

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
  if (!bookings) return;

  return (
    <div className="">
      {/* {JSON.stringify(bookings)} */}
      <h2 className="font-bold text-3xl text-center py-5">Booking data</h2>
      <div className="flex justify-end my-5">
        <Link href={`/admin/booking/offlineBooking/${scheduleId}`}>
          <Button className="mx-10">Add Booking</Button>
        </Link>
        <RouterRefreshButton />
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
          {bookings.map((booking, i) => {
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
                    <DropdownMenuContent align="end" className="">
                      <Link href={`/admin/booking/updateBooking/${booking.id}`}>
                        <DropdownMenuItem>Update</DropdownMenuItem>
                      </Link>
                      <Link href={"#"}>
                        <DropdownMenuItem>Change Schedule</DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
