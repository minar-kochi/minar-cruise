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
  srNo: number;
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
      <div className="w-fit mx-auto my-4 md:my-8 px-2 sm:mx-4">
        <div className="flex justify-end">
          <Button className="" onClick={() => toPDF()} variant={"link"}>
            <DownloadIcon className="size-6 mr-2" />
            Download Ticket
          </Button>
        </div>
        <div
          ref={targetRef}
          className="max-w-4xl md:mx-auto bg-white px-4 sm:px-8 md:px-14 py-6 md:py-10 font-sans text-sm border border-gray-300 text-black mt-2"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="space-y-2">
              <div className="flex flex-wrap">
                <span className="font-semibold w-28 sm:w-32 flex-shrink-0">
                  Booking Id
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span className="break-all">
                  {FormattedBookingData.bookingId}
                </span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-28 sm:w-32 flex-shrink-0">
                  Contact Num
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span className="break-all">
                  {FormattedBookingData.contactNum}
                </span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-28 sm:w-32 flex-shrink-0">
                  Email Id
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span className="break-all">
                  {FormattedBookingData.emailId}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap">
                <span className="font-semibold w-28 sm:w-32 flex-shrink-0">
                  Booking Mode
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>{FormattedBookingData.bookingMode}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-28 sm:w-32 flex-shrink-0">
                  Booking Date
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>{FormattedBookingDate}</span>
              </div>
            </div>
          </div>

          {/* Booking Package and Boarding Time */}
          <div className="flex flex-col sm:flex-row items-center justify-around mb-6 md:mb-8 py-4 space-y-4 sm:space-y-0">
            <div className="text-center">
              <h3 className="font-bold text-base md:text-lg mb-2">
                Booking Package
              </h3>
              <p className="text-sm md:text-base">
                {FormattedBookingData.bookingPackage}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">
                <Image
                  src={boatLogo || "/placeholder.svg"}
                  alt="boat logo"
                  width={720}
                  height={480}
                  className="w-20 h-12 sm:w-28 sm:h-16"
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base md:text-lg mb-2">
                Boarding Time
              </h3>
              <p className="text-lg md:text-xl">
                {FormattedBookingData.boardingTime}
              </p>
            </div>
          </div>

          {/* Booking Information */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 underline">
              Booking Information
            </h2>
            <div className="space-y-3 w-fit mx-auto">
              <div className="flex flex-wrap">
                <span className="font-semibold w-32 sm:w-40 flex-shrink-0">
                  Departure Date
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>{FormattedDepartureDate}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-32 sm:w-40 flex-shrink-0">
                  Departure Time
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>{FormattedBookingData.departureTime}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-32 sm:w-40 flex-shrink-0">
                  Reporting Time
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>30 mins before departure time</span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-32 sm:w-40 flex-shrink-0">
                  Adult Charges
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>
                  {(
                    FormattedBookingData.charges.passengerCharges.adult / 100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-32 sm:w-40 flex-shrink-0">
                  Child Charges
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <span>
                  {(
                    FormattedBookingData.charges.passengerCharges.children / 100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap">
                <span className="font-semibold w-32 sm:w-40 flex-shrink-0">
                  Passengers
                </span>
                <span className="mr-2 md:mr-4">:</span>
                <div className="space-y-1">
                  <div className="flex w-20 justify-between">
                    <span className="">Adult </span>
                    <span>:</span>
                    <span>{FormattedBookingData.passengers.adult}</span>
                  </div>
                  <div className="flex w-20 justify-between">
                    <span className="">Child</span>
                    <span>:</span>
                    <span>{FormattedBookingData.passengers.child}</span>
                  </div>
                  <div className="flex w-20 justify-between">
                    <span className="">Infant</span>
                    <span>:</span>
                    <span>{FormattedBookingData.passengers.infant}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="mb-6 md:mb-8">
            {/* Mobile view - single column */}
            <div className="block md:hidden space-y-2">
              <div className="border border-black">
                <div className="border-b border-black p-2 font-semibold text-sm bg-gray-50">
                  Passenger Charges in INR
                </div>
                <div className="p-2 text-left text-sm">
                  {(
                    FormattedBookingData.charges.passengerCharges.adult / 100
                  ).toFixed(2)}
                </div>
              </div>

              <div className="border border-black">
                <div className="border-b border-black p-2 font-semibold text-sm bg-gray-50">
                  Vehicle Charges in INR
                </div>
                <div className="p-2 text-left text-sm">
                  {FormattedBookingData.charges.vehicleCharges.toFixed(2)}
                </div>
              </div>

              <div className="border border-black">
                <div className="border-b border-black p-2 font-semibold text-sm bg-gray-50">
                  Additional Charges in INR
                </div>
                <div className="p-2 text-left text-sm">
                  {FormattedBookingData.charges.additionalCharges.toFixed(2)}
                </div>
              </div>

              <div className="border border-black">
                <div className="border-b border-black p-2 font-semibold text-sm bg-gray-100">
                  Total Fare in INR
                </div>
                <div className="p-2 text-left font-semibold text-sm">
                  {FormattedBookingData.charges.totalFare.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Desktop view - original table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[500px] border border-black">
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-semibold text-sm">
                      Passenger Charges in INR
                    </td>
                    <td className="border border-black p-2 text-right text-sm">
                      {(
                        FormattedBookingData.charges.passengerCharges.adult /
                        100
                      ).toFixed(2)}
                    </td>
                    <td className="border border-black p-2 font-semibold text-sm">
                      Vehicle Charges in INR
                    </td>
                    <td className="border border-black p-2 text-right text-sm">
                      {FormattedBookingData.charges.vehicleCharges.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-semibold text-sm">
                      Additional Charges in INR
                    </td>
                    <td className="border border-black p-2 text-right text-sm">
                      {FormattedBookingData.charges.additionalCharges.toFixed(
                        2,
                      )}
                    </td>
                    <td className="border border-black p-2 font-semibold text-sm">
                      Total Fare in INR
                    </td>
                    <td className="border border-black p-2 text-right font-semibold text-sm">
                      {FormattedBookingData.charges.totalFare.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Passenger Details Table */}
          <div className="mb-4 md:mb-6 overflow-x-auto">
            <table className="w-full min-w-[300px] border border-black">
              <thead>
                <tr className="bg-gray-400">
                  <th className="border border-black p-1 sm:p-2 text-center text-xs sm:text-sm">
                    Sr.No
                  </th>
                  <th className="border border-black p-1 sm:p-2 text-center text-xs sm:text-sm">
                    First Name
                  </th>
                  <th className="border border-black p-1 sm:p-2 text-center text-xs sm:text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {FormattedBookingData.passengerDetails.map(
                  (passenger, index) => (
                    <tr key={index}>
                      <td className="border border-black p-1 sm:p-2 text-center text-xs sm:text-sm">
                        {passenger.srNo}
                      </td>
                      <td className="border border-black p-1 sm:p-2 text-center text-xs sm:text-sm">
                        {passenger.firstName}
                      </td>
                      <td className="border border-black p-1 sm:p-2 text-center text-xs sm:text-sm">
                        {passenger.status}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="text-xs text-gray-700">
            <p>
              Passenger should report at terminal half an hour (30 mins) before
              departure time.
            </p>
          </div>

          {/* terms and conditions */}
          <div className="my-2">
            <h2 className="font-bold sm:text-sm text-xs">
              Terms and Conditions :
            </h2>
            <ul className="list-decimal list-inside pt-3 text-xs">
              {TermsAndConditions.map((item, index) => {
                return (
                  <li key={`${index}-${item}`} className="leading-5">
                    {" "}
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

          <footer className="text-xs sm:text-sm font-bold font-sans py-4">
            For any queries, please reach out us via mail on
            info@cochincruiseline.com or contact our passenger support team on
            <span className=""> +91 8089021666</span> (Mon to Sat 9:30AM to
            5:30PM)
          </footer>
        </div>
      </div>
    </Bounded>
  );
};

export default CruiseTicket;
