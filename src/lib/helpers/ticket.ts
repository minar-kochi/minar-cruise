import { TicketData } from "@/components/admin/dashboard/ticket/cruise-ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";
import { GST_SAC_CODE, MINAR_GSTIN } from "@/lib/helpers/gst";

export function createBookingData({
  data,
  gstin,
  sacCode,
}: {
  data: TGetUserBookingDetails;
  gstin?: string;
  sacCode?: string;
}) {
  const storedGstAmount = data?.payment.gstAmount ?? 0;

  const gst =
    storedGstAmount > 0
      ? {
          baseAmount: data?.payment.baseAmount ?? 0,
          gstRate: data?.payment.gstRate ?? 0,
          gstAmount: data?.payment.gstAmount ?? 0,
        }
      : { baseAmount: 0, gstRate: 0, gstAmount: 0 };

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
      baseAmount: gst.baseAmount,
      gstRate: gst.gstRate,
      gstAmount: gst.gstAmount,
    },
    supplierGSTIN: data?.payment.gstin ?? gstin ?? MINAR_GSTIN,
    sacCode: data?.payment.sacCode ?? sacCode ?? GST_SAC_CODE,
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
