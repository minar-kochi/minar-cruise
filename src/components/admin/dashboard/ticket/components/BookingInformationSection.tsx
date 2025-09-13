import type React from "react";
import SectionTitle from "./SectionTitle";
import DetailRow from "./DetailRow";
import { TicketData } from "../cruise-ticket";

interface PassengerCountRowProps {
  label: string;
  count: number;
  ageRange?: string;
}

const PassengerCountRow: React.FC<PassengerCountRowProps> = ({
  label,
  count,
  ageRange,
}) => (
  <div className="flex items-center gap-4">
    <span className="w-14 font-medium text-gray-600">{label}</span>
    <span className="text-gray-500">:</span>
    <span className="font-medium">{count}</span>
    {ageRange && (
      <span className="text-gray-500 text-sm">({ageRange})</span>
    )}
  </div>
);

interface BookingInformationSectionProps {
  bookingData: TicketData;
  formattedDepartureDate: string;
}

const BookingInformationSection: React.FC<BookingInformationSectionProps> = ({
  bookingData,
  formattedDepartureDate,
}) => {
  return (
    <div className="mb-8 md:mb-10">
      <SectionTitle title="Booking Information" />
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 max-w-2xl mx-auto shadow-sm">
        <DetailRow
          label="Departure Date"
          value={formattedDepartureDate}
          className="flex-wrap"
        />
        <DetailRow
          label="Departure Time"
          value={bookingData.departureTime}
          className="flex-wrap"
        />
        <DetailRow
          label="Reporting Time"
          value="30 mins before departure time"
          valueClassName="text-red-600"
          className="flex-wrap"
        />
        <DetailRow
          label="Adult Charges"
          value={`₹${(bookingData.charges.passengerCharges.adult / 100).toFixed(2)}`}
          className="flex-wrap"
        />
        <DetailRow
          label="Child Charges"
          value={`₹${(bookingData.charges.passengerCharges.children / 100).toFixed(2)}`}
          className="flex-wrap"
        />
        <div className="flex flex-wrap items-start">
          <span className="font-semibold w-36 sm:w-44 flex-shrink-0 text-gray-700">
            Passengers
          </span>
          <span className="mr-3 text-gray-500">:</span>
          <div className="space-y-2">
            <PassengerCountRow
              label="Adult"
              count={bookingData.passengers.adult}
            />
            <PassengerCountRow
              label="Child"
              count={bookingData.passengers.child}
              ageRange="3-10 yrs"
            />
            <PassengerCountRow
              label="Baby"
              count={bookingData.passengers.infant}
              ageRange="below 3 yrs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInformationSection;