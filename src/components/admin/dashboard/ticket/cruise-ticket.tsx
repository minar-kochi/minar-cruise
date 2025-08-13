import type React from "react";
import { TermsAndConditions } from "./doc-helper";
import Image from "next/image";

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
  data: TicketData | null;
}

const qrImageUrl = `/assets/documents/QR.png`;
const minarLogo = `/assets/whatsapplogo.png`;
const boatLogo = `/logo-small.png`;

const CruiseTicket: React.FC<CruiseTicketProps> = ({ data }) => {
  if(!data) return
  return (
    <div className="max-w-4xl mx-auto bg-white px-14 py-10 font-sans text-sm border border-gray-300 text-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Image
            src={minarLogo}
            alt="MINAR"
            className="w-auto h-20"
            width={720}
            height={480}
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">
            MINAR CRUISE E-TICKET
          </h1>
        </div>
        {/* <div className="w-20 h-20 bg-gray-200 flex items-center justify-center"> */}
        <Image
          src={qrImageUrl}
          alt="minar-qr-code"
          width={1080}
          height={720}
          className="w-20 h-20 flex items-center justify-center"
        />
        {/* </div> */}
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-32">Booking Id</span>
            <span className="mr-4">:</span>
            <span>{data.bookingId}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Contact Num</span>
            <span className="mr-4">:</span>
            <span>{data.contactNum}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Email Id</span>
            <span className="mr-4">:</span>
            <span>{data.emailId}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-32">Booking Mode</span>
            <span className="mr-4">:</span>
            <span>{data.bookingMode}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Booking Date</span>
            <span className="mr-4">:</span>
            <span>{data.bookingDate}</span>
          </div>
        </div>
      </div>

      {/* Booking Package and Boarding Time */}
      <div className="flex items-center justify-between mb-8 py-4">
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">Booking Package</h3>
          <p className="text-base">{data.bookingPackage}</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">
            <Image
              src={boatLogo}
              alt="boat logo"
              width={720}
              height={480}
              className="w-28 h-16"
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">Boarding Time</h3>
          <p className="text-xl font-semibold">{data.boardingTime}</p>
        </div>
      </div>

      {/* Booking Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center mb-6 underline">
          Booking Information
        </h2>
        <div className="space-y-3 w-fit mx-auto">
          <div className="flex ">
            <span className="font-semibold w-40">Departure Date</span>
            <span className="mr-4">:</span>
            <span>{data.departureDate}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Reporting Time</span>
            <span className="mr-4">:</span>
            <span>{data.reportingTime}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Departure Time</span>
            <span className="mr-4">:</span>
            <span>{data.departureTime}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Passengers</span>
            <span className="mr-4">:</span>
            <div className="space-y-1">
              <div className="flex">
                <span className="w-16">Adult</span>
                <span>{data.passengers.adult}</span>
              </div>
              <div className="flex">
                <span className="w-16">Child</span>
                <span>{data.passengers.child}</span>
              </div>
              <div className="flex">
                <span className="w-16">Infant</span>
                <span>{data.passengers.infant}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charges Table */}
      <div className="mb-8">
        <table className="w-full border border-black">
          <tbody>
            <tr>
              <td className="border border-black p-2 font-semibold">
                Passenger Charges in INR
              </td>
              <td className="border border-black p-2 text-right">
                {data.charges.passengerCharges.adult}
              </td>
              <td className="border border-black p-2 font-semibold">
                Vehicle Charges in INR
              </td>
              <td className="border border-black p-2 text-right">
                {data.charges.vehicleCharges.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold">
                Additional Charges in INR
              </td>
              <td className="border border-black p-2 text-right">
                {data.charges.additionalCharges.toFixed(2)}
              </td>
              <td className="border border-black p-2 font-semibold">
                Total Fare in INR
              </td>
              <td className="border border-black p-2 text-right font-semibold">
                {data.charges.totalFare.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Passenger Details Table */}
      <div className="mb-6">
        <table className="w-full border border-black">
          <thead>
            <tr className="bg-gray-400">
              <th className="border border-black p-2 text-left">Sr.No</th>
              <th className="border border-black p-2 text-left">First Name</th>
              <th className="border border-black p-2 text-left">Last Name</th>
              <th className="border border-black p-2 text-left">
                Age / Gender
              </th>
              <th className="border border-black p-2 text-left">Seat No.</th>
              <th className="border border-black p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.passengerDetails.map((passenger, index) => (
              <tr key={index}>
                <td className="border border-black p-2">{passenger.srNo}</td>
                <td className="border border-black p-2">
                  {passenger.firstName}
                </td>
                <td className="border border-black p-2">
                  {passenger.lastName}
                </td>
                <td className="border border-black p-2">
                  {passenger.age}
                </td>
                <td className="border border-black p-2">{passenger.seatNo}</td>
                <td className="border border-black p-2">{passenger.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-700">
        <p>
          Passenger should report at terminal One Hour (1 Hour) before departure
          time. Terminal gate close 30 minutes before scheduled departure.
        </p>
      </div>

      {/* terms and conditions */}
      <div className="my-2">
        <h2 className="font-bold">Terms and Conditions :</h2>
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

      {/* Important Notes */}
      <div className="my-2">
        <h2 className="font-bold py-3">Important Note:</h2>
        <div className="text-xs leading-5 space-y-2">
          <p className="">
            Damage to any property of this Ferry viz. the Doors, Seats, TV, AC,
            life jackets etc are punishable and defaulters shall be charged
            accordingly. If the penalty charges are not paid suitable actions
            shall be initiated and defaulters shall not be allowed to deboard
            the Ferry/leave terminal premises.
          </p>
          <p>
            Important information: We wish to remind you that DG SEA CONNECT
            never asks for your personal banking and security details like
            password, CVV, OTP etc.
          </p>
          <p>
            Note: This is computer generated ticket/invoice and does not require
            a signature/stamp. Please do not reply to this email. It has been
            sent from an email account that is not monitored.
          </p>
        </div>
      </div>

      <footer className="text-xs font-bold font-sans py-4">
        For any queries, please reach out us via mail on helpdesk@dgferry.com or
        contact our passenger support team on 9924441847 (Mon to Sat 9:30AM to
        5:30PM)
      </footer>
    </div>
  );
};

export default CruiseTicket;
