import { $Enums } from "@prisma/client";
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

interface InvalidScheduleEmailProps {
  packageTitle: string;
  date: string;
  scheduleTime: string;
  name: string;
  email: string;
  babyCount: string;
  adultCount: string;
  childCount: string;
}

export default function InvalidScheduleEmail({
  packageTitle = "Adventure Package",
  date = "2024-12-25",
  scheduleTime = "15:30",
  name = "John Doe",
  email = "john.doe@example.com",
  babyCount = "0",
  adultCount = "2",
  childCount = "1",
}: InvalidScheduleEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Critical: Invalid schedule booking error for {packageTitle} on {date}
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://via.placeholder.com/150x50/dc2626/ffffff?text=MINAR"
                width="150"
                height="50"
                alt="Minar"
                className="my-0 mx-auto"
              />
            </Section>

            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              🚨 <strong>Critical Booking Error</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">
              A booking attempt has failed due to an{" "}
              <strong>invalid schedule time</strong>. This requires immediate
              attention to prevent customer dissatisfaction.
            </Text>

            <Section className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
              <Heading className="text-red-800 text-[18px] font-semibold mt-0 mb-3">
                Booking Details
              </Heading>

              <Row className="mb-2">
                <Column className="w-[120px]">
                  <Text className="text-red-700 text-[14px] font-medium m-0">
                    Package:
                  </Text>
                </Column>
                <Column>
                  <Text className="text-red-900 text-[14px] font-semibold m-0">
                    {packageTitle}
                  </Text>
                </Column>
              </Row>

              <Row className="mb-2">
                <Column className="w-[120px]">
                  <Text className="text-red-700 text-[14px] font-medium m-0">
                    Date:
                  </Text>
                </Column>
                <Column>
                  <Text className="text-red-900 text-[14px] font-semibold m-0">
                    {date}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column className="w-[120px]">
                  <Text className="text-red-700 text-[14px] font-medium m-0">
                    Schedule Time:
                  </Text>
                </Column>
                <Column>
                  <Text className="text-red-900 text-[14px] font-bold bg-red-100 px-2 py-1 rounded m-0">
                    {scheduleTime} ❌
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
              <Heading className="text-blue-800 text-[16px] font-semibold mt-0 mb-3">
                Customer Information
              </Heading>

              <Row className="mb-2">
                <Column className="w-[80px]">
                  <Text className="text-blue-700 text-[14px] font-medium m-0">
                    Name:
                  </Text>
                </Column>
                <Column>
                  <Text className="text-blue-900 text-[14px] m-0">{name}</Text>
                </Column>
              </Row>

              <Row>
                <Column className="w-[80px]">
                  <Text className="text-blue-700 text-[14px] font-medium m-0">
                    Email:
                  </Text>
                </Column>
                <Column>
                  <Link
                    href={`mailto:${email}`}
                    className="text-blue-600 text-[14px] underline"
                  >
                    {email}
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
              <Heading className="text-gray-800 text-[16px] font-semibold mt-0 mb-3">
                Booking Size
              </Heading>

              <Row>
                <Column className="text-center">
                  <Text className="text-gray-600 text-[12px] font-medium m-0 mb-1">
                    Adults
                  </Text>
                  <Text className="text-gray-900 text-[18px] font-bold m-0">
                    {adultCount}
                  </Text>
                </Column>
                <Column className="text-center">
                  <Text className="text-gray-600 text-[12px] font-medium m-0 mb-1">
                    Children
                  </Text>
                  <Text className="text-gray-900 text-[18px] font-bold m-0">
                    {childCount}
                  </Text>
                </Column>
                <Column className="text-center">
                  <Text className="text-gray-600 text-[12px] font-medium m-0 mb-1">
                    Babies
                  </Text>
                  <Text className="text-gray-900 text-[18px] font-bold m-0">
                    {babyCount}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Section className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 my-6">
              <Heading className="text-yellow-800 text-[16px] font-semibold mt-0 mb-3">
                ⚡ Action Required
              </Heading>

              <Text className="text-yellow-800 text-[14px] leading-[20px] m-0 mb-3">
                <strong>Immediate steps needed:</strong>
              </Text>

              <Text className="text-yellow-700 text-[14px] leading-[20px] m-0 mb-2">
                1. Verify the schedule time for this package
              </Text>
              <Text className="text-yellow-700 text-[14px] leading-[20px] m-0 mb-2">
                2. Update the system accordingly
              </Text>
              <Text className="text-yellow-700 text-[14px] leading-[20px] m-0 mb-4">
                3. Contact the customer to resolve and reschedule
              </Text>

              <Button
                className="bg-red-600 rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 w-full"
                href={`mailto:${email}?subject=Regarding your booking for ${packageTitle}&body=Dear ${name},%0D%0A%0D%0AWe apologize for the inconvenience with your booking...`}
              >
                Contact Customer Now
              </Button>
            </Section>

            <Section className="bg-red-100 border-l-4 border-red-500 p-4 my-6">
              <Text className="text-red-800 text-[14px] font-semibold leading-[20px] m-0">
                🔴 Critical Error Alert
              </Text>
              <Text className="text-red-700 text-[13px] leading-[18px] m-0 mt-2">
                This is a critical error that prevents successful bookings.
                Please investigate and resolve as soon as possible to maintain
                customer satisfaction and prevent revenue loss.
              </Text>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              This is an automated system alert from Minar Website Booking
              System.
              <br />
              Generated on {new Date().toLocaleString()}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
