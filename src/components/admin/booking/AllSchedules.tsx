import { format } from "date-fns";
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
import { getSchedulesAndBookingByDate } from "@/db/data/dto/schedule";
import CustomBookingBadge from "@/components/custom/CustomBookingBadge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface IAllSchedules {
  className?: string;
}

export default async function AllSchedules({ className }: IAllSchedules) {
  const schedules = await getSchedulesAndBookingByDate();
  if (!schedules?.length) return <>No schedules found</>;
  console.log(schedules);
  return (
    <div>
      <div className="">
        <div className="flex justify-end p-5">
          <Link href={`/admin/schedule`}>
            <Button className="">Add new Schedule</Button>
          </Link>
        </div>
        <Table className="border ">
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-center border">Date</TableHead>
              <TableHead className="text-center border">Day</TableHead>
              <TableHead className="text-center border">Timing</TableHead>
              <TableHead className="text-center border">Package</TableHead>
              <TableHead className="text-center border">Booked seats</TableHead>
              <TableHead className="text-center border">
                Remaining seats
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((item) => {
              const formattedDate = format(item.day, "MM/dd/yyyy");
              const formattedDay = format(item.day, "cccc");
              return (
                <>
                  <TableRow key={item.id} className="text-center">
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{formattedDay}</TableCell>
                    <TableCell>
                      {item.fromTime} - {item.toTime}
                    </TableCell>
                    <TableCell>{item.Package?.title}</TableCell>
                    <TableCell>{item.bookedSeats}</TableCell>
                    <TableCell>{150 - item.bookedSeats}</TableCell>
                    <TableCell>
                      <Link href={`/admin/booking/viewBookings/${item.id}`}>
                        <Badge className="">
                          <CustomBookingBadge
                            label="View Booking"
                            bookingId={""}
                          />
                        </Badge>
                      </Link>
                    </TableCell>
                  </TableRow>
                </>
              );
            })}

            {/* {schedules.map((schedule)=> {
              const { Booking } = schedule
              

              return <>
              <TableRow>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{formattedDay}</TableCell>
                <TableCell>{schedule.fromTime}-{schedule.toTime}</TableCell>
                <TableCell>{schedule.schedulePackage}</TableCell>
                <TableCell>{}</TableCell>
              </TableRow>
              </>
            })} */}
            {/* {schedules.flatMap((schedule) =>
              schedule.Booking.map((item) => {
                return (
                  <>
                    <TableRow>
                      <TableCell>{schedule.id}</TableCell>
                      <TableCell>{item.id}</TableCell>
                    </TableRow>
                    
                  </>
                );
              }),
            )} */}
            {/* {schedules.map((schedule) => {
              // console.log(schedule.Booking)
              const booking = schedule.Booking.reduce(
                (acc, item) => ({
                  numOfChildren: acc.numOfChildren + item.numOfChildren,
                  numOfAdults: acc.numOfAdults + item.numOfAdults,
                  numOfBaby: acc.numOfBaby + item.numOfBaby
                }),
                { numOfChildren: 0, numOfAdults: 0, numOfBaby: 0 }
              );
              let totalCount = booking.numOfAdults + booking.numOfBaby + booking.numOfChildren
              return (
                <TableRow key={schedule.id} className="text-center">
                  <TableCell>{"formattedDate"}</TableCell>
                  <TableCell>{"formattedDay"}</TableCell>
                  <TableCell>
                    {schedule.fromTime} - {schedule.toTime}
                  </TableCell>
                  <TableCell>{schedule.schedulePackage}</TableCell>
                  <TableCell>{totalCount}</TableCell>
                  <TableCell>{150 - totalCount}</TableCell>
                  <TableCell>
                    <Link href={`/admin/booking/viewBookings/${schedule.id}`}>
                      <Badge className="">
                        <CustomBookingBadge
                          label="View Booking"
                          bookingId={""}
                        />
                      </Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {schedules.flatMap((schedule) =>
              schedule.Booking.map((booking) => {
                const formattedDate = format(schedule.day, "MM/dd/yyyy");
                const formattedDay = format(schedule.day, "cccc");
                const totalCount =
                  booking.numOfAdults +
                  booking.numOfChildren +
                  booking.numOfBaby;
                console.log(booking);
                return <></>;
              }),
            )} */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// => {
//   const { day,fromTime,toTime, id, packageId, schedulePackage, Booking } = item;
//   const formattedDate = format(day, "MM/dd/yyyy");
//   const formattedDay = format(day, "cccc")

//   //@HOTFIX modify key prop in a better way

//   return (
//
//   );
// }
