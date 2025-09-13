import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { FAILED_TO_CREATE_BOOKING_EMAIL } from "./system-send-email";

export function bookingFailureEmailTemplate({
  scheduleTime,
  packageTitle,
  date,
  adultCount,
  babyCount,
  childCount,
  email,
  name,
  contact,
  RazerPayEventId,
  eventId,
}: FAILED_TO_CREATE_BOOKING_EMAIL["payload"]) {
  const totalGuests =
    parseInt(adultCount || "0") +
    parseInt(childCount || "0") +
    parseInt(babyCount || "0");

  return (
    <Html>
      <Head />
      <Preview>
        🚨 URGENT: Booking Failed to Process - Admin Action Required
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] shadow-lg rounded my-[40px] mx-auto p-[20px] max-w-[700px]">
            <Section className="my-[10px]">
              <Img
                src={`https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q`}
                width="1920"
                height="1080"
                alt="Minar Cruise"
                className="my-0 mx-auto object-contain w-[180px] h-[50px]"
              />
            </Section>

            <Heading className="text-red-600 text-[24px] font-normal text-center p-0 my-[15px] mx-0">
              <strong>🚨 URGENT: Booking Failed to Process</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>Admin Team</strong>,
            </Text>

            <Text className="text-red-700 text-[16px] leading-[24px] font-semibold">
              A booking attempt has failed to process successfully in our
              system. The customer has completed their booking process, but the
              reservation could not be saved to our database. Immediate action
              is required to ensure customer satisfaction and prevent service
              disruption.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

            <Section className="bg-red-100 p-4 rounded border-l-4 border-red-600 my-4">
              <Heading className="text-[18px] font-bold text-red-800 m-0 mb-2">
                🔴 System Alert
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Alert Type:</strong> Booking Database Insert Failure
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Status:</strong> Customer booking not saved to system
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </Text>
            </Section>

            <Section className="bg-blue-50 p-4 rounded border-l-4 border-blue-500 my-4">
              <Heading className="text-[18px] font-bold text-blue-700 m-0 mb-2">
                🛳️ Booking Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Package:</strong> {packageTitle}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Date:</strong> {date}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Time:</strong> {scheduleTime}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Total Guests:</strong> {totalGuests} (Adults:{" "}
                {adultCount}, Children: {childCount}, Babies: {babyCount})
              </Text>
            </Section>

            <Section className="bg-green-50 p-4 rounded border-l-4 border-green-500 my-4">
              <Heading className="text-[18px] font-bold text-green-700 m-0 mb-2">
                👤 Customer Information
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Contact:</strong> {contact}
              </Text>
            </Section>

            <Section className="bg-purple-50 p-4 rounded border-l-4 border-purple-500 my-4">
              <Heading className="text-[18px] font-bold text-purple-700 m-0 mb-2">
                💳 Payment Information
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Razorpay Event ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded text-[12px]">
                  {RazerPayEventId}
                </span>
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>System Event ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded text-[12px]">
                  {eventId}
                </span>
              </Text>
            </Section>

            <Section className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500 my-4">
              <Heading className="text-[18px] font-bold text-yellow-700 m-0 mb-2">
                📋 Immediate Actions Required
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>1. Verify Payment:</strong> Check Razorpay dashboard to
                confirm payment status and amount received.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>2. Manual Booking:</strong> Create the booking manually
                in your admin system using the details above.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>3. Customer Contact:</strong> Reach out to the customer
                to confirm their booking and provide booking confirmation.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>4. Capacity Check:</strong> Ensure the requested date
                and time slot has available capacity.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>5. System Review:</strong> Investigate the technical
                issue to prevent future booking failures.
              </Text>
            </Section>

            <Section className="bg-orange-50 p-4 rounded border border-orange-300 my-4">
              <Text className="text-orange-800 text-[14px] leading-[22px] font-semibold text-center">
                ⚠️ Priority: HIGH - Customer may be expecting confirmation.
                Please process this booking within 2 hours to maintain service
                quality.
              </Text>
            </Section>

            <Text className="text-gray-700 text-[14px] leading-[20px] text-center font-medium">
              For technical support or escalation, contact the IT team
              immediately. For customer service issues, reach out to the
              operations manager.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px] text-justify">
              This message was produced and distributed by{" "}
              <strong>Minar Cruise Services</strong>, Inc., GF,40/6185, Marine
              Drive, Ernakulam, Kerala 682031. © 2022, All rights reserved.
              Minar cruise is a registered trademark of{" "}
              <Link href={process.env.NEXT_PUBLIC_DOMAIN}>
                {process.env.NEXT_PUBLIC_DOMAIN}
              </Link>
              , Inc. View our{" "}
              <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/privacy-policy`}>
                privacy policy
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
