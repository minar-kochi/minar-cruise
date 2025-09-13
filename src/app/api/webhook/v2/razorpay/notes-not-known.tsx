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
import { UNKNOWN_NOTES_EVENT } from "./system-send-email";

export function ContaminatedNotesEmailTemplate({
  eventId,
  eventFailedCount,
  paymentEntity,
}: UNKNOWN_NOTES_EVENT) {
  const paymentAmount = (paymentEntity.amount / 100).toFixed(2); // Convert paise to rupees
  const paymentDate = new Date(
    paymentEntity.created_at * 1000,
  ).toLocaleString();

  return (
    <Html>
      <Head />
      <Preview>
        🚨 URGENT: Payment Notes Contaminated - Booking Data Invalid
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
              <strong>🚨 URGENT: Payment Notes Contaminated</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>Admin Team</strong>,
            </Text>

            <Text className="text-red-700 text-[16px] leading-[24px] font-semibold">
              A successful payment has been received, but the booking cannot be
              processed due to contaminated or invalid information in the
              payment notes. The customer has paid but their booking details are
              corrupted, requiring immediate manual intervention to complete
              their reservation and ensure customer satisfaction.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

            <Section className="bg-red-100 p-4 rounded border-l-4 border-red-600 my-4">
              <Heading className="text-[18px] font-bold text-red-800 m-0 mb-2">
                🔴 Data Integrity Alert
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Issue Type:</strong> Payment Notes Data Contamination
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Status:</strong> Payment successful but booking data
                invalid
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Failed Attempts:</strong> {eventFailedCount}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Alert Time:</strong> {new Date().toLocaleString()}
              </Text>
            </Section>

            <Section className="bg-green-50 p-4 rounded border-l-4 border-green-500 my-4">
              <Heading className="text-[18px] font-bold text-green-700 m-0 mb-2">
                ✅ Confirmed Payment Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Payment ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded text-[12px]">
                  {paymentEntity.id}
                </span>
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Order ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded text-[12px]">
                  {paymentEntity.order_id}
                </span>
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Amount:</strong> ₹{paymentAmount}{" "}
                {paymentEntity.currency}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Payment Status:</strong>{" "}
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[12px] font-semibold">
                  {paymentEntity.status.toUpperCase()}
                </span>
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Payment Method:</strong> {paymentEntity.method}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Payment Date:</strong> {paymentDate}
              </Text>
            </Section>

            <Section className="bg-blue-50 p-4 rounded border-l-4 border-blue-500 my-4">
              <Heading className="text-[18px] font-bold text-blue-700 m-0 mb-2">
                👤 Customer Contact Information
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Email:</strong> {paymentEntity.email}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Contact:</strong> {paymentEntity.contact}
              </Text>
            </Section>

            <Section className="bg-orange-50 p-4 rounded border-l-4 border-orange-500 my-4">
              <Heading className="text-[18px] font-bold text-orange-700 m-0 mb-2">
                ⚠️ Contaminated Data Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Event ID:</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded text-[12px]">
                  {eventId}
                </span>
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Corrupted Notes:</strong>{" "}
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-[12px] font-mono">
                  {JSON.stringify(paymentEntity.notes).substring(0, 100)}...
                </span>
              </Text>
              {paymentEntity.error_code && (
                <Text className="text-[14px] leading-[20px] m-0 mb-1">
                  <strong>Error Code:</strong> {paymentEntity.error_code}
                </Text>
              )}
              {paymentEntity.error_description && (
                <Text className="text-[14px] leading-[20px] m-0">
                  <strong>Error Description:</strong>{" "}
                  {paymentEntity.error_description}
                </Text>
              )}
            </Section>

            <Section className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500 my-4">
              <Heading className="text-[18px] font-bold text-yellow-700 m-0 mb-2">
                🔧 Required Actions
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>1. Customer Outreach:</strong> Contact customer
                immediately using the provided email/phone to gather correct
                booking details.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>2. Payment Verification:</strong> Confirm payment
                receipt and verify amount matches intended booking package.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>3. Manual Booking Creation:</strong> Create booking
                manually in the system using correct customer-provided
                information.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>4. Data Investigation:</strong> Analyze the contaminated
                notes to identify the source of data corruption.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-2">
                <strong>5. System Audit:</strong> Review the booking form and
                payment integration for potential data validation issues.
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>6. Customer Confirmation:</strong> Send booking
                confirmation once reservation is manually created.
              </Text>
            </Section>

            <Section className="bg-gray-50 p-4 rounded border-l-4 border-gray-500 my-4">
              <Heading className="text-[18px] font-bold text-gray-700 m-0 mb-2">
                🚨 Potential Causes
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Frontend form validation bypass or malicious data injection
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Special characters or encoding issues in customer-entered data
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Session timeout or browser issues during form submission
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • API integration errors between frontend and payment gateway
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                • Data serialization/deserialization problems in payment notes
              </Text>
            </Section>

            <Section className="bg-red-50 p-4 rounded border border-red-300 my-4">
              <Text className="text-red-800 text-[14px] leading-[22px] font-semibold text-center">
                💰 URGENT: Customer has paid ₹{paymentAmount} but has no
                booking. Contact within 30 minutes to prevent customer
                dissatisfaction and potential refund requests.
              </Text>
            </Section>

            <Text className="text-gray-700 text-[14px] leading-[20px] text-center font-medium">
              For immediate customer service support, contact the Customer
              Relations team. For technical data issues, escalate to the
              Development team.
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
