import { TicketData } from "@/components/admin/dashboard/ticket/cruise-ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";

export function createBookingData({ data }: { data: TGetUserBookingDetails }) {
  const details: TicketData = {
    bookingId: data?.id ?? "",
    bookingDate: data?.createdAt.toString() ?? "",
    bookingMode: data?.payment.modeOfPayment ?? "",
    bookingPackage: data?.schedule.Package?.packageCategory ?? "",
    charges: {
      additionalCharges: 0,
      passengerCharges: {
        adult: data?.schedule.Package?.adultPrice ?? 720,
        children: data?.schedule.Package?.childPrice ?? 480,
        infant: 0,
      },
      totalFare: data?.payment.totalAmount ?? 0,
      vehicleCharges: 0,
    },
    contactNum: data?.user.contact ?? "",
    boardingTime: data?.schedule.Package?.fromTime ?? "",
    reportingTime: data?.schedule.Package?.fromTime ?? "",
    departureDate: data?.schedule.day.toString() ?? "",
    departureTime: data?.schedule.Package?.fromTime ?? "",
    emailId: data?.user.email ?? "",
    passengerDetails: [
      {
        firstName: data?.user.name ?? "",
        age: "",
        lastName: "",
        seatNo: "",
        srNo: 1,
        status: "Confirmed",
      },
    ],
    passengers: {
      adult: data?.numOfAdults ?? 0,
      child: data?.numOfChildren ?? 0,
      infant: data?.numOfChildren ?? 0,
    },
  };

  return details;
}
