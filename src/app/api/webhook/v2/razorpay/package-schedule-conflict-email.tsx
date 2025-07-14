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
import { SCHEDULE_PACKAGE_CONFLICTS_EMAIL } from "./system-send-email";

// Email Template Component
export function packageScheduleConflictEmailTemplate({
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
  conflictedPackageTitle,
}: SCHEDULE_PACKAGE_CONFLICTS_EMAIL["payload"]) {
  const totalGuests =
    parseInt(adultCount || "0") +
    parseInt(childCount || "0") +
    parseInt(babyCount || "0");

  return (
    <Html>
      <Head />
      <Preview>🚨 URGENT: Package Schedule Conflict Detected</Preview>
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
              <strong>🚨 URGENT: Package Schedule Conflict Detected</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>Admin Team</strong>,
            </Text>

            <Text className="text-red-700 text-[16px] leading-[24px] font-semibold">
              A critical error has occurred during the booking process. The
              scheduled time exists but is associated with a different package.
              This requires immediate attention and resolution.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

            <Section className="bg-red-100 p-4 rounded border-l-4 border-red-600 my-4">
              <Heading className="text-[18px] font-bold text-red-800 m-0 mb-2">
                🔴 Error Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Error Code:</strong> SCHEDULE_PACKAGE_CONFLICTS
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Issue:</strong> Package ID mismatch for existing
                schedule
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Conflicting Package:</strong>{" "}
                {conflictedPackageTitle}{" "}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </Text>
            </Section>

            <Section className="bg-orange-50 p-4 rounded border-l-4 border-orange-500 my-4">
              <Heading className="text-[18px] font-bold text-orange-700 m-0 mb-2">
                ⚠️ Booking Attempt Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Package Title:</strong> {packageTitle}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Schedule Date:</strong> {date}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Schedule Time:</strong> {scheduleTime}
              </Text>
            </Section>

            <Section className="bg-blue-50 p-4 rounded border-l-4 border-blue-500 my-4">
              <Heading className="text-[18px] font-bold text-blue-700 m-0 mb-2">
                👤 Customer Information
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Contact:</strong> {contact}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Adults:</strong> {adultCount} |{" "}
                <strong>Children:</strong> {childCount} |{" "}
                <strong>Babies:</strong> {babyCount}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Total Guests:</strong> {totalGuests}
              </Text>
            </Section>

            <Section className="bg-green-50 p-4 rounded border-l-4 border-green-500 my-4">
              <Heading className="text-[18px] font-bold text-green-700 m-0 mb-2">
                💳 Payment Information
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Razorpay Event ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded">
                  {RazerPayEventId}
                </span>
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Event ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded">
                  {eventId}
                </span>
              </Text>
            </Section>

            <Section className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500 my-4">
              <Heading className="text-[18px] font-bold text-yellow-700 m-0 mb-2">
                📋 Required Actions
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>1.</strong> Immediately review the Admin Dashboard for
                schedule conflicts.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>2.</strong> Check Razorpay for the payment status and
                details.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>3.</strong> Contact the customer to inform them of the
                issue and discuss rescheduling options.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>4.</strong> Investigate the root cause of the package ID
                mismatch in the scheduling system.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>5.</strong> Resolve the conflict and update the system
                to prevent future occurrences.
              </Text>
            </Section>

            <Section className="bg-red-50 p-4 rounded border border-red-300 my-4">
              <Text className="text-red-800 text-[14px] leading-[22px] font-semibold text-center">
                ⚠️ This is a critical error that could lead to double-bookings
                or customer dissatisfaction. Please prioritize and resolve this
                issue as soon as possible.
              </Text>
            </Section>

            <Text className="text-gray-700 text-[14px] leading-[20px] text-center font-medium">
              For any questions or escalations, please contact the IT support
              team immediately.
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
