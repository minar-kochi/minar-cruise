import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllBookingDataFromToday } from "@/db/data/dto/booking";
import {
  getAllSchedules,
  getSchedule,
  getSchedulePackages,
  TGetAllSchedules,
} from "@/db/data/dto/schedule";
import CustomTable from "@/components/custom/CustomTable";
import { MouseEventHandler } from "react";
import CustomBookingBadge from "@/components/custom/CustomBookingBadge";

interface IUpdateBookingCardProps {
  className?: string;
}

export default async function UpdateBookingCard({
  className,
}: IUpdateBookingCardProps) {
  const schedules: TGetAllSchedules = await getAllSchedules();
  if (!schedules) return;
  const { } = schedules[0]
  // function fetchBooking(e: HTMLButtonElement){

  // }
  // schedules.map(item => {
  //   item.Booking.
  // })
  return (
    <div>
      {/* {JSON.stringify(schedules)} */}
      <div className="py-10">
        <h2 className="font-bold text-xl pl-10 ">Schedule data</h2>
        <Table className="border ">
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-center border w-[500px]">Date</TableHead>
              <TableHead className="text-center border w-[500px]">Package</TableHead>
              <TableHead className="text-center border">Seats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((item, i) => {
              const { day, schedulePackage, Booking, id,totalBookings } = item;
              const formattedDate = format(day, "MM/dd/yyyy");
              //@HOTFIX modify key prop in a better way
              return (
                <>
                  <TableRow key={i} className="text-center">
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{schedulePackage}</TableCell>
                    <TableCell className="flex justify-center relative">
                    {totalBookings.toString()}
                        <Link href={`/admin/booking/offlineBooking/${id}`}>
                        <Badge className="absolute right-10">
                          <CustomBookingBadge
                            label="Add Booking"
                            bookingId={""}
                          />
                        </Badge>
                      </Link>
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
        {/* <div className="">
          <h2 className="font-bold text-xl pl-10">Booking data</h2>

          <CustomTable
            tableBodyContent={[{}, {}]}
            label="home"
            tableHeadLabel={[
              "Name",
              "phone",
              "Email",
              "Count",
              "description",
              "Payment mode",
              "advance",
              "discount",
              "Total amount",
            ]}
          />
        </div> */}
      </div>
    </div>
  );
}
