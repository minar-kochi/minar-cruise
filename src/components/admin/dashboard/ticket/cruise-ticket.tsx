import type React from "react";
import { TermsAndConditions } from "./doc-helper";
import Image from "next/image";
import { format } from "date-fns";
import { createBookingData } from "@/lib/helpers/ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";
import Bounded from "@/components/elements/Bounded";
import { Button } from "@/components/ui/button";
import { usePDF } from "react-to-pdf";
import { DownloadIcon } from "lucide-react";

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  age: string;
  seatNo: string;
  status: string;
}

export interface TicketData {
  bookingId: string;
  contactNum: string;
  emailId: string;
  bookingMode: string;
  bookingDate: string;
  bookingPackage: string;
  boardingTime: string;
  departureDate: string;
  reportingTime: string;
  departureTime: string;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  charges: {
    passengerCharges: {
      adult: number;
      children: number;
      infant: number;
    };
    additionalCharges: number;
    vehicleCharges: number;
    totalFare: number;
  };
  passengerDetails: PassengerDetails[];
}

interface CruiseTicketProps {
  data: TGetUserBookingDetails | null;
}

const qrImageUrl = `/assets/documents/QR.png`;
const minarLogo = `/assets/whatsapplogo.png`;
const boatLogo = `/logo-small.png`;

const CruiseTicket: React.FC<CruiseTicketProps> = ({ data }) => {
  const { targetRef, toPDF } = usePDF({ filename: `Minar-Boarding-Pass` });

  if (!data) return;

  const FormattedBookingData = createBookingData({ data: data });

  const {
    boardingTime,
    bookingDate,
    departureDate,
    departureTime,
    reportingTime,
    charges: {
      totalFare,
      passengerCharges: { children, adult: adultCharges },
    },
    passengers: { adult, child },
  } = FormattedBookingData;

  const FormattedBookingDate = format(bookingDate, "dd/MM/yyyy");
  const FormattedDepartureDate = format(departureDate, "dd/MM/yyyy");

  return (
    <Bounded className="md:px-4 px-[2px]">
      <div className="w-fit mx-auto my-4 md:my-8 px-2">
        <div className="flex justify-end">
          <Button className="" onClick={() => toPDF()} variant={"link"}>
            <DownloadIcon className="size-6 mr-2" />
            Download Ticket
          </Button>
        </div>
        <div
          ref={targetRef}
          className="max-w-4xl md:mx-auto bg-white px-6 sm:px-10 md:px-16 py-8 md:py-12 font-sans text-sm border-2 border-gray-200 shadow-lg text-black mt-4 rounded-lg"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center order-1 sm:order-1">
              <Image
                src={minarLogo || "/placeholder.svg"}
                alt="MINAR"
                className="w-auto h-12 sm:h-16 md:h-20"
                width={720}
                height={480}
              />
            </div>
            <div className="text-center order-2 sm:order-2 flex-1">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-black">
                MINAR CRUISE E-TICKET
              </h1>
            </div>
            <Image
              src={qrImageUrl || "/placeholder.svg"}
              alt="minar-qr-code"
              width={1080}
              height={720}
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center order-3 sm:order-3"
            />
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-10 bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
                  Name
                </span>
                <span className="mx-3 text-gray-500">:</span>
                <span className="break-all font-medium">
                  {data?.user?.name || "Guest"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
                  Booking ID
                </span>
                <span className="mx-3 text-gray-500">:</span>
                <span className="break-all font-medium">
                  {FormattedBookingData.bookingId}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
                  Contact Number
                </span>
                <span className="mx-3 text-gray-500">:</span>
                <span className="break-all font-medium">
                  {FormattedBookingData.contactNum}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
                  Email ID
                </span>
                <span className="mx-3 text-gray-500">:</span>
                <span className="break-all font-medium">
                  {FormattedBookingData.emailId}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
                  Booking Mode
                </span>
                <span className="mx-3 text-gray-500">:</span>
                <span className="font-medium">{FormattedBookingData.bookingMode}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold w-36 flex-shrink-0 text-gray-700">
                  Booking Date
                </span>
                <span className="mx-3 text-gray-500">:</span>
                <span className="font-medium">{FormattedBookingDate}</span>
              </div>
            </div>
          </div>

          {/* Booking Package and Boarding Time */}
          <div className="flex flex-col sm:flex-row items-center justify-around mb-8 md:mb-10 py-6 space-y-6 sm:space-y-0 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg">
            <div className="text-center px-4">
              <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800 uppercase tracking-wide">
                Booking Package
              </h3>
              <p className="text-sm md:text-base font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">
                {FormattedBookingData.bookingPackage}
              </p>
            </div>
            <div className="text-center px-4">
              <div className="bg-white rounded-full p-4 shadow-md">
                <Image
                  src={boatLogo || "/placeholder.svg"}
                  alt="boat logo"
                  width={720}
                  height={480}
                  className="w-20 h-12 sm:w-28 sm:h-16 mx-auto"
                />
              </div>
            </div>
            <div className="text-center px-4">
              <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800 uppercase tracking-wide">
                Boarding Time
              </h3>
              <p className="text-lg md:text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm">
                {FormattedBookingData.boardingTime}
              </p>
            </div>
          </div>

          {/* Booking Information */}
          <div className="mb-8 md:mb-10">
            <h2 className="text-lg md:text-xl font-bold text-center mb-6 md:mb-8 text-gray-800 relative">
              <span className="bg-white px-4 relative z-10">Booking Information</span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 max-w-2xl mx-auto shadow-sm">
              <div className="flex flex-wrap items-center">
                <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
                  Departure Date
                </span>
                <span className="mr-3 text-gray-500">:</span>
                <span className="font-medium">{FormattedDepartureDate}</span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
                  Departure Time
                </span>
                <span className="mr-3 text-gray-500">:</span>
                <span className="font-medium">{FormattedBookingData.departureTime}</span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
                  Reporting Time
                </span>
                <span className="mr-3 text-gray-500">:</span>
                <span className="font-medium text-red-600">30 mins before departure time</span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
                  Adult Charges
                </span>
                <span className="mr-3 text-gray-500">:</span>
                <span className="font-medium">
                  ₹{(
                    FormattedBookingData.charges.passengerCharges.adult / 100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
                  Child Charges
                </span>
                <span className="mr-3 text-gray-500">:</span>
                <span className="font-medium">
                  ₹{(
                    FormattedBookingData.charges.passengerCharges.children / 100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap items-start">
                <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
                  Passengers
                </span>
                <span className="mr-3 text-gray-500">:</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="w-14 font-medium text-gray-600">Adult</span>
                    <span className="text-gray-500">:</span>
                    <span className="font-medium">{FormattedBookingData.passengers.adult}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-14 font-medium text-gray-600">Child</span>
                    <span className="text-gray-500">:</span>
                    <span className="font-medium">{FormattedBookingData.passengers.child}</span>
                    <span className="text-gray-500 text-sm">
                      (3-10 yrs)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-14 font-medium text-gray-600">Baby</span>
                    <span className="text-gray-500">:</span>
                    <span className="font-medium">{FormattedBookingData.passengers.infant}</span>
                    <span className="text-gray-500 text-sm">
                      (below 3 yrs)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Passenger Details Table */}
          <div className="mb-6 md:mb-8 overflow-x-auto">
            <h2 className="text-lg md:text-xl font-bold text-center mb-6 text-gray-800 relative">
              <span className="bg-white px-4 relative z-10">Passenger Details</span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </h2>
            <table className="w-full min-w-[300px] border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <th className="border-r border-gray-300 p-3 sm:p-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                    Sr.No
                  </th>
                  <th className="border-r border-gray-300 p-3 sm:p-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                    First Name
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {FormattedBookingData.passengerDetails.map(
                  (passenger, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                      <td className="border-r border-gray-200 p-3 sm:p-4 text-center text-sm sm:text-base font-medium">
                        {index+1}
                      </td>
                      <td className="border-r border-gray-200 p-3 sm:p-4 text-center text-sm sm:text-base font-medium">
                        {passenger.firstName}
                      </td>
                      <td className="p-3 sm:p-4 text-center text-sm sm:text-base">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          passenger.status.toLowerCase() === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {passenger.status}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <p className="text-sm font-medium text-yellow-800">
              <span className="font-bold">Important:</span> Passenger should report at terminal half an hour (30 mins) before departure time.
            </p>
          </div>

          {/* terms and conditions */}
          <div className="my-6 bg-gray-50 p-6 rounded-lg">
            <h2 className="font-bold text-sm md:text-base mb-4 text-gray-800 border-b border-gray-300 pb-2">
              Terms and Conditions
            </h2>
            <ul className="list-decimal list-inside space-y-2 text-xs md:text-sm text-gray-700 leading-relaxed">
              {TermsAndConditions.map((item, index) => {
                return (
                  <li key={`${index}-${item}`} className="pl-2">
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* <TermsAndConditions/> */}

          {/* Important Notes */}
          {/* <div className="my-2">
        <h2 className="font-bold py-3 text-xs sm:text-sm">Important Note:</h2>
        <div className="text-xs leading-5 space-y-2">
          <p className="">
            Damage to any property of this Ferry viz. the Doors, Seats, TV, AC, life jackets etc are punishable and
            defaulters shall be charged accordingly. If the penalty charges are not paid suitable actions shall be
            initiated and defaulters shall not be allowed to deboard the Ferry/leave terminal premises.
          </p>
          <p>
            Important information: We wish to remind you that DG SEA CONNECT never asks for your personal banking and
            security details like password, CVV, OTP etc.
          </p>
          <p>
            Note: This is computer generated ticket/invoice and does not require a signature/stamp. Please do not reply
            to this email. It has been sent from an email account that is not monitored.
          </p>
        </div>
      </div> */}

          <footer className="mt-8 pt-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50 -mx-6 sm:-mx-10 md:-mx-16 px-6 sm:px-10 md:px-16 py-6 rounded-b-lg">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Need Help? Contact Us
              </p>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> <a href="mailto:info@cochincruiseline.com" className="text-gray-700 hover:text-gray-900 underline">info@cochincruiseline.com</a>
                </p>
                <p>
                  <span className="font-medium">Phone:</span> <span className="text-gray-700 font-medium">+91 8089021666</span>
                </p>
                <p className="text-gray-500 italic">
                  (Mon to Sat 9:30AM to 5:30PM)
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Bounded>
  );
};

export default CruiseTicket;
