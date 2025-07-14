import { cn } from "@/lib/utils";
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

export function sendUnprocessableEventEmail({
  event,
  razerPayEventId,
  customerContact,
  customerEmail,
  notes,
}: {
  customerContact?: string | undefined | null;
  customerEmail?: string | undefined | null;
  notes?: any;
  event: string;
  razerPayEventId: string;
}) {
  const formatPayload = (data: any) => {
    try {
      if (!data) return "N/A";
      if (typeof data === "string") return data;
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Unprocessable Event Alert - {event}</Preview>
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
              <strong>⚠️ Unprocessable Event Alert</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>Admin Team</strong>,
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              An event could not be processed despite successful payment
              completion. This requires immediate attention to resolve the
              customer&apos;s booking and prevent revenue loss.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

            <Section className="bg-red-50 p-4 rounded border-l-4 border-red-500 my-4">
              <Heading className="text-[18px] font-bold text-red-700 m-0 mb-2">
                Event Details
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Event Type:</strong> {"UNPROCESSABLE_CONTENT"}
              </Text>
               <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Event ID:</strong> {event}
              </Text>
              {/*  */}
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                <strong>Razorpay Event ID:</strong> {razerPayEventId}
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </Text>
            </Section>

            {(customerEmail || customerContact) && (
              <Section className="bg-blue-50 p-4 rounded border-l-4 border-blue-500 my-4">
                <Heading className="text-[18px] font-bold text-blue-700 m-0 mb-2">
                  Customer Information
                </Heading>
                {customerEmail && (
                  <Text className="text-[14px] leading-[20px] m-0 mb-1">
                    <strong>Email:</strong> {customerEmail}
                  </Text>
                )}
                {customerContact && (
                  <Text className="text-[14px] leading-[20px] m-0">
                    <strong>Contact:</strong> {customerContact}
                  </Text>
                )}
              </Section>
            )}

            {notes && (
              <Section className="bg-gray-50 p-4 rounded border-l-4 border-gray-500 my-4">
                <Heading className="text-[18px] font-bold text-gray-700 m-0 mb-2">
                  Event Payload & Notes
                </Heading>
                <Text className="text-[12px] leading-[18px] font-mono bg-white p-3 rounded border whitespace-pre-wrap">
                  {formatPayload(notes)}
                </Text>
              </Section>
            )}

            <Section className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500 my-4">
              <Heading className="text-[18px] font-bold text-yellow-700 m-0 mb-2">
                Required Actions
              </Heading>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Verify payment status in Razorpay dashboard
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Check booking status in the system
              </Text>
              <Text className="text-[14px] leading-[20px] m-0 mb-1">
                • Contact customer if booking confirmation is missing
              </Text>
              <Text className="text-[14px] leading-[20px] m-0">
                • Escalate to development team if technical issue persists
              </Text>
            </Section>

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
