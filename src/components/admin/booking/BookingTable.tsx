import DropMenuClient from "@/app/(admin)/admin/booking/view/[scheduleId]/DropMenuContent";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TGetBookingsByScheduleId } from "@/db/data/dto/schedule";
import { format } from "date-fns";
import { EllipsisVertical } from "lucide-react";

export default async function BookingTable({
  bookings,
  scheduleId,
}: {
  bookings?: TGetBookingsByScheduleId;
  scheduleId: string;
}) {
  return (
    <Table className="">
      <TableHeader className="bg-muted-foreground/10 ">
        <TableRow className="text-md ">
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:p-2">
            Id
          </TableHead>
          <TableHead className="h-16 max-sm:text-[9px] font-bold max-sm:text-pretty ">
            Name
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:p-0">
            Date of Booking
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:p-2">
            Package
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
            Advance Paid
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
            Total Bill
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty">
            Phone
          </TableHead>
          <TableHead className="hidden max-sm:flex items-center align-bottom h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty">
            Count
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
            Adults
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
            Child
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
            kids
          </TableHead>
          <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
            Description
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings && bookings.length > 0
          ? bookings.map((booking, i) => {
              const formattedDate = format(booking.createdAt, "dd/MM/yyyy");
              return (
                <TableRow
                  key={`aa-${booking.id}-view-booking-table-row-${i}`}
                  className=" cursor-pointer"
                >
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-left  max-sm:text-[9px] max-sm:p-0 max-sm:text-nowrap">
                    {booking.user.name}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-2">
                    {formattedDate}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0">
                    {booking.schedule.schedulePackage}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                    {booking.payment.advancePaid}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:hidden">
                    {booking.payment.totalAmount}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0">
                    {booking.user.contact}
                  </TableCell>
                  <TableCell className="hidden  max-sm:text-[9px] max-sm:block">
                    {booking.numOfAdults +
                      booking.numOfChildren +
                      booking.numOfBaby}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                    {booking.numOfAdults}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                    {booking.numOfChildren}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
                    {booking.numOfBaby}
                  </TableCell>
                  <TableCell className=" max-sm:text-[9px] max-sm:p-0 max-sm:hidden">
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
  );
}
