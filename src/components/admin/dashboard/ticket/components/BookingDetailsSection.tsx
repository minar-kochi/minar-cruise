import type React from "react";
import DetailRow from "./DetailRow";
import { TicketData } from "../cruise-ticket";

interface BookingDetailsSectionProps {
  customerName: string;
  bookingData: TicketData;
  formattedBookingDate: string;
}

const BookingDetailsSection: React.FC<BookingDetailsSectionProps> = ({
  customerName,
  bookingData,
  formattedBookingDate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-10 bg-gray-50 p-6 rounded-lg">
      <div className="space-y-4">
        <DetailRow label="Name" value={customerName} />
        <DetailRow label="Booking ID" value={bookingData.bookingId} />
        <DetailRow label="Contact Number" value={bookingData.contactNum} />
      </div>
      <div className="space-y-4">
        <DetailRow label="Email ID" value={bookingData.emailId} />
        <DetailRow label="Booking Mode" value={bookingData.bookingMode} />
        <DetailRow label="Booking Date" value={formattedBookingDate} />
      </div>
    </div>
  );
};

export default BookingDetailsSection;