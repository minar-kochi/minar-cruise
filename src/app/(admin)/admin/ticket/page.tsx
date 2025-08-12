import CruiseTicket from "@/components/admin/dashboard/ticket/cruise-ticket";
import DocumentHandler from "@/components/admin/dashboard/ticket/DocumentHandler";

const sampleTicketData = {
  bookingId: "12312323",
  contactNum: "9565412022",
  emailId: "example@gmail.com",
  bookingMode: "Online",
  bookingDate: "04/07/25",
  bookingPackage: "Sunset cruise",
  boardingTime: "12:50",
  departureDate: "Monday 24/05/25",
  reportingTime: "11:00",
  departureTime: "11:30",
  passengers: {
    adult: 2,
    child: 1,
    infant: 0,
  },
  charges: {
    passengerCharges: 400.0,
    additionalCharges: 0.0,
    vehicleCharges: 0.0,
    totalFare: 400.0,
  },
  passengerDetails: [
    {
      srNo: 1,
      firstName: "Muhammed Aslam",
      lastName: "CK",
      ageGender: "27 / Male",
      seatNo: "EB103",
      status: "Confirmed",
    },
    {
      srNo: 2,
      firstName: "Muhammed Aslam",
      lastName: "CK",
      ageGender: "27 / Male",
      seatNo: "EB103",
      status: "Confirmed",
    },
    {
      srNo: 3,
      firstName: "Muhammed Aslam",
      lastName: "CK",
      ageGender: "27 / Male",
      seatNo: "EB103",
      status: "Confirmed",
    },
  ],
}

export default function page() {
  return (
    <div className="h-full">
      <h1 className="text-4xl font-bold text-center w-full py-10">
        Booking ticket section
      </h1>
      <div className="">
        {/* <DocumentHandler /> */}
        <CruiseTicket data={sampleTicketData}/>
      </div>
    </div>
  );
}
