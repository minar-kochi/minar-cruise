import {
  Body,
  Container,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import HeaderSection from "./user-email-components/HeaderSection";
import ConfirmationHeader from "./user-email-components/ConfirmationHeader";
import CustomerInformation from "./user-email-components/CustomerInformation";
import TripDetails from "./user-email-components/TripDetails";
import PaymentSummary from "./user-email-components/PaymentSummary";
import FooterSection from "./user-email-components/FooterSection";
import TermsAndConditions from "./user-email-components/TermsAndConditions";

interface BookingConfirmationEmailForUserProps {
  customerName?: string;
  packageTitle: string;
  contact: string;
  adult: number;
  child: number;
  infant: number;
  date?: string;
  bookingDate: string;
  boardingTime: string;
  BookingId?: string;
  status: string;
  totalAmount: number;
}

export const BookingConfirmationEmailForUser = ({
  customerName,
  date,
  packageTitle,
  BookingId,
  totalAmount,
  status,
  adult,
  boardingTime,
  bookingDate,
  child,
  contact,
  infant,
}: BookingConfirmationEmailForUserProps) => {

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#fcfcfc",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <Tailwind>
          <Container
            style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
          >
            {/* Header Section */}
            <HeaderSection />

            {/* Confirmation Header */}
            <ConfirmationHeader status={status} />

            {/* Customer Information Section */}

            <CustomerInformation
              BookingId={BookingId}
              bookingDate={bookingDate}
              contact={contact}
              customerName={customerName}
            />

            {/* Trip Details Section */}

            <TripDetails
              adult={adult}
              boardingTime={boardingTime}
              child={child}
              date={date}
              infant={infant}
              packageTitle={packageTitle}
            />

            {/* Payment Summary Section */}
            <PaymentSummary totalAmount={totalAmount} />

            {/* Terms and conditions */}
            <TermsAndConditions/>
            
            {/* Footer Section */}
            <FooterSection />
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmailForUser;
