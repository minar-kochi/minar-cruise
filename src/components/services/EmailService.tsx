
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
  totalCount: number
  duration: string
  totalAmount: number
  status: string
}



export const EmailSendBookingConfirmation = ({
  customerName,
  date,
  packageTitle,
  BookingId,
  totalCount,
  duration,
  totalAmount,
  status
}: EmailSendBookingConfirmationProps) => {
  const Subject = `here is your Booking ID: ${BookingId}`;

  return (
    <Html>
      <Head />
      <Preview>{Subject}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] shadow-lg rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="my-[10px] ">
              {/* @TODO Need to change this URL */}
              <Img
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/assets/logo.png`}
                width="1920"
                height="1080"
                alt="Minar Logo"
                className="my-0 mx-auto object-contain w-[180px] h-[50px]"
              />
            </Section>
            {/* <Heading className="text-black text-[24px] font-normal text-center p-0 my-[15px] mx-0">
              <strong>{Title} !</strong>
            </Heading> */}
            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>{customerName}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We are thrilled to <strong>confirm</strong> your booking with{" "}
              <strong>Minar Cruise</strong>. Below are the details of your
              upcoming event:
            </Text>
            <div className="py-[20px]">
              <strong className="text-md font-sans font-black">Cruise Details :-</strong>
              <ul className="pl-5 list-outside">
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Booking Number - </strong>
                    {"  "}
                    {BookingId}
                  </Text>
                </li>
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Number of Guests - </strong> {totalCount}
                  </Text>
                </li>
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Package Name - </strong>
                    {packageTitle}
                  </Text>
                </li>
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Duration - </strong> {duration}
                  </Text>
                </li>
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Date - </strong>
                    {date}
                  </Text>
                </li>
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Total - </strong> {`₹${totalAmount}/-`}
                  </Text>
                </li>
                <li className=" pl-0 font-sans tracking-wide">
                  <Text>
                    <strong>Status - </strong> {status}
                  </Text>
                </li>
              </ul>
            </div>
            <Text className="text-black text-[14px] leading-[24px] pb-[20px] tracking-wide">
              Please make sure to bring your booking confirmation and valid
              identification with you to the departure port. Boarding will start
              15 minutes prior to the scheduled departure time, and we recommend
              arriving at least 30 minutes before departure.
            </Text>
            <div className="flex justify-center ">
              <Button
                className="max-w-[100px]  bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT}`}
              >
                Enquire Now
              </Button>
            </div>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px]  leading-[24px] text-justify">
              Thank you for choosing <strong>Minar</strong>. We are committed to
              making your cruise a memorable experience. If you have any
              questions or need further assistance, feel free to
              <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`}>
                {" "}
                contact us.{" "}
              </Link>
            </Text>
            <Text className="text-[#666666]  text-[12px] leading-[24px] text-justify">
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
};

// EmailSendBookingConfirmationProps.PreviewProps = {
//   customerName: "Customer",
//   BookingId: "#12as2d158ssads",
//   packageTitle: "Sunset Cruise",
//   totalCount: 25,
//   duration: "5:30 - 6:30",
//   totalAmount: 5000,
//   status: "Confirmed",
//   date: "18/08/24"
// } as VercelInviteUserEmailProps;

export default EmailSendBookingConfirmation;

