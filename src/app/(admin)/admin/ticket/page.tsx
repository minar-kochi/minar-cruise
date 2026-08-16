import CruiseTicket from "@/components/admin/dashboard/ticket/cruise-ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";

/**
 * A fixed sample booking for previewing the printed ticket layout.
 *
 * The instants are real Dates now. They used to be "12/04/25" strings, which
 * type-checked only because the tRPC types wrongly claimed `string` for every
 * Date; the preview was rendering values the real page could never receive.
 */
const SAMPLE_BOOKED_AT = new Date("2025-04-12T04:30:00.000Z"); // 10:00 IST
const SAMPLE_SAILING_DAY = new Date("2025-04-12T00:00:00.000Z"); // @db.Date

const sampleTicketData: TGetUserBookingDetails = {
  createdAt: SAMPLE_BOOKED_AT,
  id: "21323332154",
  numOfAdults: 2,
  numOfBaby: 2,
  numOfChildren: 1,
  payment: {
    id: "556846846",
    advancePaid: 5200,
    createdAt: SAMPLE_BOOKED_AT,
    discount: 0,
    modeOfPayment: "GPAY",
    totalAmount: 5200,
    baseAmount: 4952,
    gstRate: 5.0,
    gstAmount: 248,
    gstin: "32BSTPK7128K2Z8",
    sacCode: "998555",
    updatedAt: SAMPLE_BOOKED_AT,
  },
  schedule: {
    day: SAMPLE_SAILING_DAY,
    startsAt: SAMPLE_BOOKED_AT,
    endsAt: SAMPLE_BOOKED_AT,
    Package: {
      adultPrice: 720,
      childPrice: 480,
      duration: 2,
      packageCategory: "BREAKFAST",
      packageType: "Breakfast",
      startMinutesIst: 540,
    },
  },
  updatedAt: SAMPLE_BOOKED_AT,
  user: {
    contact: "98532646423",
    email: "aslu@gmail.com",
    id: "121321412",
    name: "Aslu",
  },
};
export default function page() {
  return (
    <div className="h-full">
      <h1 className="text-4xl font-bold text-center w-full py-10">
        Booking ticket section
      </h1>
      <div className="">
        {/* <DocumentHandler /> */}
        <CruiseTicket data={sampleTicketData} />
      </div>
    </div>
  );
}
