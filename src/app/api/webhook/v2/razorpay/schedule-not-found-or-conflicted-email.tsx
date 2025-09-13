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

interface ScheduleConflictEmailProps {
  scheduleTime: string;
  packageTitle: string;
  date: string;
  adultCount: string;
  babyCount: string;
  childCount: string;
  email: string;
  name: string;
  contact: string;
  RazerPayEventId: string;
  eventId: string;
}

export function scheduleConflictEmailTemplate({
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
}: ScheduleConflictEmailProps) {
  const totalGuests =
    parseInt(adultCount || "0") +
    parseInt(childCount || "0") +
    parseInt(babyCount || "0");

  return (
    <Html>
      <Head />
      <Preview>
        🚨 URGENT: Schedule Conflict Detected - Admin Intervention Required
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
              <strong>🚨 URGENT: Schedule Conflict Detected</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>Admin Team</strong>,
            </Text>

            <Text className="text-red-700 text-[16px] leading-[24px] font-semibold">
              A critical schedule conflict has been detected during the booking
              process. The requested schedule time appears to be conflicting,
              tampered with, or missing from our system. This requires immediate
              investigation and resolution to prevent service disruption and
              maintain customer satisfaction.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

            <Section className="bg-red-100 p-4 rounded border-l-4 border-red-600 my-4">
              <Heading className="text-[18px] font-bold text-red-800 m-0 mb-2">
                🔴 Schedule Alert
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Alert Type:</strong> Schedule Time
                Conflict/Tampering/Missing
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Issue:</strong> Requested schedule time cannot be
                validated or processed
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Status:</strong> Booking attempt blocked due to schedule
                anomaly
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Detection Time:</strong> {new Date().toLocaleString()}
              </Text>
            </Section>

            <Section className="bg-orange-50 p-4 rounded border-l-4 border-orange-500 my-4">
              <Heading className="text-[18px] font-bold text-orange-700 m-0 mb-2">
                ⚠️ Problematic Schedule Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Package:</strong> {packageTitle}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Requested Date:</strong> {date}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Conflicting Time:</strong> {scheduleTime}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Guest Count:</strong> {totalGuests} (Adults:{" "}
                {adultCount}, Children: {childCount}, Babies: {babyCount})
              </Text>
            </Section>

            <Section className="bg-blue-50 p-4 rounded border-l-4 border-blue-500 my-4">
              <Heading className="text-[18px] font-bold text-blue-700 m-0 mb-2">
                👤 Affected Customer
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
                💳 Payment Transaction Details
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
                🔍 Investigation & Resolution Steps
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>1. Schedule Audit:</strong> Immediately review the
                schedule database for the requested date and time.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>2. Conflict Analysis:</strong> Check for double
                bookings, overlapping schedules, or data inconsistencies.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>3. Payment Verification:</strong> Confirm payment status
                in Razorpay dashboard before proceeding.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>4. Customer Communication:</strong> Contact customer to
                explain the situation and offer alternative time slots.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>5. Data Integrity Check:</strong> Investigate potential
                system tampering or data corruption.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>6. Schedule Correction:</strong> Update schedule system
                and implement preventive measures.
              </Text>
            </Section>

            <Section className="bg-gray-50 p-4 rounded border-l-4 border-gray-500 my-4">
              <Heading className="text-[18px] font-bold text-gray-700 m-0 mb-2">
                🚨 Possible Causes
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Schedule time slot has been removed or modified after customer
                selection
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Double booking attempt on the same time slot
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Database synchronization issues between booking and schedule
                systems
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Unauthorized modification of schedule data
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                • System lag causing outdated schedule information display
              </Text>
            </Section>

            <Section className="bg-red-50 p-4 rounded border border-red-300 my-4">
              <Text className="text-red-800 text-[14px] leading-[22px] font-semibold text-center">
                🚨 CRITICAL: Schedule conflicts can lead to operational chaos
                and customer complaints. Resolve within 1 hour and implement
                immediate safeguards.
              </Text>
            </Section>

            <Text className="text-gray-700 text-[14px] leading-[20px] text-center font-medium">
              For urgent schedule management issues, contact the Operations
              Manager immediately. For technical system problems, escalate to IT
              support team.
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
