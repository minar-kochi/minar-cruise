import { formatIstTime } from "@/lib/datetime";
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

  /**
   * `advancePaid` means "amount actually collected" — that is how the admin
   * offline form fills it (booking.ts createNewOfflineBooking) and how the
   * booking-link webhook path fills it. The public online flow leaves it at 0
   * because the customer always pays in full, so a zero here reads as "nothing
   * outstanding" and every pre-existing booking keeps rendering exactly as it
   * did before this field existed.
   */
  const totalFare = data?.payment.totalAmount ?? 0;
  const collected = data?.payment.advancePaid ?? 0;
  const amountPaid = collected > 0 ? collected : totalFare;
  const balanceDue = Math.max(0, totalFare - amountPaid);

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
      totalFare,
      amountPaid,
      balanceDue,
      vehicleCharges: 0,
      baseAmount: gst.baseAmount,
      gstRate: gst.gstRate,
      gstAmount: gst.gstAmount,
    },
    supplierGSTIN: data?.payment.gstin ?? gstin ?? MINAR_GSTIN,
    sacCode: data?.payment.sacCode ?? sacCode ?? GST_SAC_CODE,
    contactNum: data?.user.contact ?? "",
    boardingTime: formatIstTime(data?.schedule.startsAt ?? null),
    reportingTime: formatIstTime(data?.schedule.startsAt ?? null),
    departureDate: data?.schedule.day.toString() ?? "",
    departureTime: formatIstTime(data?.schedule.startsAt ?? null),
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
