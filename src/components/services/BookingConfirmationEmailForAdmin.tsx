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
import { format } from "date-fns";
import * as React from "react";

interface BookingConfirmationEmailForAdmin {
  BookingId: string;
  packageTitle: string;
  Name: string;
  email: string;
  phone: string;
  totalAmount: number;
  scheduleDate: string;
  BookingDate: string;
  adultCount: number;
  childCount: number;
  babyCount: number;
  scheduleId: string;
}

const domain = process.env.NEXT_PUBLIC_DOMAIN;

export function BookingConfirmationEmailForAdmin({
  Name,
  email,
  packageTitle,
  phone,
  scheduleDate,
  totalAmount,
  BookingId,
  BookingDate,
  adultCount,
  babyCount,
  childCount,
  scheduleId,
}: BookingConfirmationEmailForAdmin) {
  const Subject = `🎉 New Booking Alert: ${packageTitle} - ${scheduleDate}`;
  const totalGuests = adultCount + childCount + babyCount;

  return (
    <Html>
      <Head />
      <Preview>{Subject}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-gray-200 bg-white shadow-xl rounded-lg my-[40px] mx-auto p-0 max-w-[700px] overflow-hidden">
            {/* Header Section */}
            <Section className="bg-gradient-to-r from-blue-600 to-blue-800 p-[30px] text-center">
              <Img
                src={`https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q`}
                width="180"
                height="50"
                alt="Minar Cruise"
                className="my-0 mx-auto object-contain w-[180px] h-[50px] mb-4"
              />
              <Heading className="text-white text-[28px] font-bold text-center p-0 m-0">
                New Booking Received!
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="p-[30px]">
              <Text className="text-gray-700 text-[16px] leading-[24px] mb-6">
                Hello Admin,
              </Text>
              <Text className="text-gray-700 text-[15px] leading-[26px] mb-8">
                A new booking has been placed for{" "}
                <strong className="text-blue-700">{packageTitle}</strong>.
                Please review the details below and take necessary action to
                confirm the booking with the customer.
              </Text>

              {/* Booking Summary Card */}
              <Section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <Row>
                  <Column className="w-1/2">
                    <Text className="text-blue-900 font-bold text-[18px] m-0 mb-2">
                      {packageTitle}
                    </Text>
                    <Text className="text-blue-700 text-[14px] m-0">
                      📅 {scheduleDate}
                    </Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="text-blue-900 font-bold text-[24px] m-0">
                      ₹{totalAmount.toLocaleString()}
                    </Text>
                    <Text className="text-blue-600 text-[14px] m-0">
                      {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Customer Information */}
              <Section className="mb-8">
                <Heading className="text-gray-800 text-[20px] font-bold mb-4 border-b-2 border-gray-200 pb-2">
                  Customer Information
                </Heading>
                <Row className="mb-4">
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide m-0 mb-1">
                      Customer Name
                    </Text>
                    <Text className="text-gray-900 text-[15px] font-medium m-0 mb-4">
                      {Name}
                    </Text>
                    <Text className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide m-0 mb-1">
                      Email Address
                    </Text>
                    <Link
                      href={`mailto:${email}`}
                      className="text-blue-600 text-[15px] font-medium no-underline hover:underline"
                    >
                      {email}
                    </Link>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide m-0 mb-1">
                      Phone Number
                    </Text>
                    <Link
                      href={`tel:${phone}`}
                      className="text-blue-600 text-[15px] font-medium no-underline hover:underline mb-4 block"
                    >
                      {phone}
                    </Link>
                    <Text className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide m-0 mb-1">
                      Booking Date
                    </Text>
                    <Text className="text-gray-900 text-[15px] font-medium m-0">
                      {BookingDate}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Guest Details */}
              <Section className="mb-8">
                <Heading className="text-gray-800 text-[20px] font-bold mb-4 border-b-2 border-gray-200 pb-2">
                  Guest Details
                </Heading>
                <Row>
                  <Column className="w-1/3 text-center">
                    <Section className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <Text className="text-green-800 text-[24px] font-bold m-0">
                        {adultCount}
                      </Text>
                      <Text className="text-green-600 text-[12px] font-semibold uppercase m-0">
                        Adults
                      </Text>
                    </Section>
                  </Column>
                  <Column className="w-1/3 text-center">
                    <Section className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <Text className="text-orange-800 text-[24px] font-bold m-0">
                        {childCount}
                      </Text>
                      <Text className="text-orange-600 text-[12px] font-semibold uppercase m-0">
                        Children
                      </Text>
                    </Section>
                  </Column>
                  <Column className="w-1/3 text-center">
                    <Section className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <Text className="text-purple-800 text-[24px] font-bold m-0">
                        {babyCount}
                      </Text>
                      <Text className="text-purple-600 text-[12px] font-semibold uppercase m-0">
                        Babies
                      </Text>
                    </Section>
                  </Column>
                </Row>
              </Section>

              {/* Booking Reference */}
              <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <Text className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide m-0 mb-2">
                  Booking Reference ID
                </Text>
                <Text className="text-gray-900 text-[20px] font-mono font-bold m-0 mb-4 bg-white p-3 rounded border tracking-wider">
                  #{BookingId}
                </Text>
                <Text className="text-gray-600 text-[12px] font-semibold uppercase tracking-wide m-0 mb-2">
                  Schedule ID
                </Text>
                <Text className="text-gray-900 text-[16px] font-mono m-0 bg-white p-3 rounded border tracking-wide">
                  {scheduleId}
                </Text>
              </Section>

              {/* Action Button */}
              <Section className="text-center mb-8">
                <Button
                  href={`${process.env.NEXT_PUBLIC_DOMAIN}/admin/booking/view/${scheduleId}`}
                  className="bg-blue-600 text-white text-[16px] font-semibold py-4 px-8 rounded-lg no-underline hover:bg-blue-700 transition-colors"
                >
                  View Full Booking Details →
                </Button>
              </Section>
            </Section>

            {/* Footer */}
            <Hr className="border border-solid border-gray-200 my-0 mx-0 w-full" />
            <Section className="bg-gray-100 p-[30px]">
              <Text className="text-gray-600 text-[12px] leading-[20px] text-center m-0">
                This notification was sent by{" "}
                <strong>Minar Cruise Services</strong>
                <br />
                GF, 40/6185, Marine Drive, Ernakulam, Kerala 682031
                <br />
                © 2024 Minar Cruise Services. All rights reserved.
                <br />
                <Link
                  href={`${process.env.NEXT_PUBLIC_DOMAIN}/privacy-policy`}
                  className="text-blue-600 no-underline"
                >
                  Privacy Policy
                </Link>{" "}
                |
                <Link
                  href={process.env.NEXT_PUBLIC_DOMAIN}
                  className="text-blue-600 no-underline ml-1"
                >
                  Website
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
