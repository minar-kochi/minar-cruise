import CruiseTicket from "@/components/admin/dashboard/ticket/cruise-ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";

const sampleTicketData: TGetUserBookingDetails = {
  createdAt: "12/04/25",
  id: "21323332154",
  numOfAdults: 2,
  numOfBaby: 2,
  numOfChildren: 1,
  payment: {
    id: "556846846",
    advancePaid: 5200,
    createdAt: "12/04/25",
    discount: 0,
    modeOfPayment: "GPAY",
    totalAmount: 5200,
    updatedAt: "12/04/25",
  },
  schedule: {
    day: "12/04/25",
    Package: {
      adultPrice: 720,
      childPrice: 480,
      duration: 2,
      fromTime: "",
      packageCategory: "BREAKFAST",
      packageType: "Breakfast",
      toTime: "",
    },
  },
  updatedAt: "12/04/25",
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
