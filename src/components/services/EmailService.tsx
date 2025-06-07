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

interface EmailSendBookingConfirmationProps {
  customerName?: string;
  date?: string;
  packageTitle: string;
  BookingId?: string;
  totalCount: number;
  duration: string;
  totalAmount: number;
  status: string;
}

export const EmailSendBookingConfirmation = ({
  customerName,
  date,
  packageTitle,
  BookingId,
  totalCount,
  duration,
  totalAmount,
  status,
}: EmailSendBookingConfirmationProps) => {
  const Subject = `Booking Confirmation - ${BookingId}`;
  const isConfirmed = status?.toLowerCase() === "confirmed";
  const isPending = status?.toLowerCase() === "pending";

  return (
    <Html>
      <Head />
      <Preview>{Subject}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="max-w-[600px] mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <Section className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-center">
              <Img
                src={`https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q`}
                width="200"
                height="60"
                alt="Minar Cruise Logo"
                className="mx-auto mb-4 object-contain filter brightness-0 invert"
              />
              <Heading className="text-gray-800 text-2xl font-bold m-0 mb-2">
                Booking Confirmation
              </Heading>
              <Text className="text-gray-800 text-base m-0">
                Your cruise adventure awaits!
              </Text>
            </Section>

            {/* Status Badge */}
            <Section className="px-8 py-6 text-center">
              <div
                className={`inline-flex  items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  isConfirmed
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : isPending
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {status}
              </div>
            </Section>

            {/* Main Content */}
            <Section className="px-8 pb-4">
              <Text className="text-gray-800 text-base leading-relaxed mb-6">
                Dear <strong>{customerName || "Valued Guest"}</strong>,
              </Text>

              <Text className="text-gray-700 text-base leading-relaxed mb-6">
                Thank you for choosing <strong>Minar Cruise</strong>! We&apos;re
                delighted to confirm your booking and look forward to providing
                you with an unforgettable experience on the water.
              </Text>
            </Section>

            {/* Booking Details Card */}
            <Section className="px-8 pb-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <Heading className="text-gray-900 text-lg font-bold mb-4 m-0">
                  Cruise Details
                </Heading>

                <Row className="mb-4">
                  <Column className="w-1/2 pr-2">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 m-0">
                        Booking ID
                      </Text>
                      <Text className="text-gray-900 text-sm font-mono font-bold m-0">
                        {BookingId || "N/A"}
                      </Text>
                    </div>
                  </Column>
                  <Column className="w-1/2 pl-2">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 m-0">
                        Journey Date
                      </Text>
                      <Text className="text-gray-900 text-sm font-bold m-0">
                        {date || "TBD"}
                      </Text>
                    </div>
                  </Column>
                </Row>

                <Row className="mb-4">
                  <Column>
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 m-0">
                        Package
                      </Text>
                      <Text className="text-gray-900 text-sm font-bold m-0">
                        {packageTitle}
                      </Text>
                    </div>
                  </Column>
                </Row>

                <Row className="mb-4">
                  <Column className="w-1/2 pr-2">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 m-0">
                        Guests
                      </Text>
                      <Text className="text-gray-900 text-sm font-bold m-0">
                        {totalCount} {totalCount === 1 ? "Guest" : "Guests"}
                      </Text>
                    </div>
                  </Column>
                  <Column className="w-1/2 pl-2">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 m-0">
                        Duration
                      </Text>
                      <Text className="text-gray-900 text-sm font-bold m-0">
                        {duration}
                      </Text>
                    </div>
                  </Column>
                </Row>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Row>
                    <Column className="w-1/2">
                      <Text className="text-blue-700 text-sm font-semibold m-0">
                        Total Amount
                      </Text>
                    </Column>
                    <Column className="w-1/2 text-right">
                      <Text className="text-blue-900 text-xl font-bold m-0">
                        ₹{totalAmount}/-
                      </Text>
                    </Column>
                  </Row>
                </div>
              </div>
            </Section>

            {/* Important Information */}
            <Section className="px-8 pb-6">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <Heading className="text-amber-800 text-sm font-bold mb-2 m-0 flex items-center">
                  <span className="text-amber-600 mr-2">⚠️</span>
                  Important Information
                </Heading>
                <Text className="text-amber-700 text-sm leading-relaxed m-0">
                  Please bring your booking confirmation and valid ID to the
                  departure port. Boarding begins 15 minutes before departure.
                  We recommend arriving 30 minutes early.
                </Text>
              </div>
            </Section>

            {/* Action Button */}
            <Section className="px-8 pb-8 text-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-6 rounded-lg no-underline inline-block transition-colors duration-200"
                href={`tel:${process.env.NEXT_PUBLIC_ENQUIRE_CONTACT}`}
              >
                Contact Us for Enquiries
              </Button>
            </Section>

            <Hr className="border-gray-200 mx-8 my-6" />

            {/* Footer */}
            <Section className="px-8 pb-8">
              <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                Thank you for choosing <strong>Minar Cruise</strong>. We&apos;re
                committed to making your experience memorable and enjoyable. For
                any questions or assistance, please don&apos;t hesitate to{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`}
                  className="text-blue-600 underline"
                >
                  contact our team
                </Link>
                .
              </Text>

              <Text className="text-gray-500 text-xs leading-relaxed">
                This message was sent by <strong>Minar Cruise Services</strong>,
                Inc.
                <br />
                GF, 40/6185, Marine Drive, Ernakulam, Kerala 682031
                <br />© 2024 All rights reserved. Minar Cruise is a registered
                trademark of{" "}
                <Link
                  href={process.env.NEXT_PUBLIC_DOMAIN}
                  className="text-blue-600 underline"
                >
                  {process.env.NEXT_PUBLIC_DOMAIN}
                </Link>
                <br />
                <Link
                  href={`${process.env.NEXT_PUBLIC_DOMAIN}/privacy-policy`}
                  className="text-blue-600 underline"
                >
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailSendBookingConfirmation;
