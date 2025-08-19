import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import HeaderSection from "./user-email-components/HeaderSection";
import ConfirmationHeader from "./user-email-components/ConfirmationHeader";
import CustomerInformation from "./user-email-components/CustomerInformation";
import TripDetails from "./user-email-components/TripDetails";
import PaymentSummary from "./user-email-components/PaymentSummary";
import { ThemeConfig } from "./user-email-components/ThemeConfig";
import { TermsAndConditions } from "@/components/admin/dashboard/ticket/doc-helper";
import FooterSection from "./user-email-components/FooterSection";

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
  // const Subject = `Booking Confirmation - ${BookingId}`;
  // const isConfirmed = status?.toLowerCase() === "confirmed";
  // const isPending = status?.toLowerCase() === "pending";

  // const totalPassengers = adult + child + infant;

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

            <Text
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: ThemeConfig.textForeground,
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              Terms and conditions
            </Text>
            <Text
              style={{
                color: "red",
                fontWeight: 600,
                textAlign: "center",
                fontSize: "12px",
                maxWidth: "340px",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {TermsAndConditions.map((item) => (
                <>
                  {item}
                  <br />
                </>
              ))}
            </Text>
            {/* Footer Section */}
            <FooterSection />
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmailForUser;
