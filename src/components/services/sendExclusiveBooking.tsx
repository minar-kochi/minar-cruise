import { TExclusivePackageValidator } from "@/lib/validators/exclusivePackageContactValidator";
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

interface ExclusiveBookingEmailToAdmin {
  name: string;
  email: string;
  phone: string;
  adultCount: number;
  childCount: number;
  babyCount: number;
  selectedDate: string;
  selectedTime: string;
  token: string | undefined;
}

// const domain = process.env.NEXT_PUBLIC_DOMAIN;

export default function ExclusiveBookingEmailToAdmin({
  Duration,
  token,
  eventType,
  email,
  name,
  phone,
  selectedDate,
}: TExclusivePackageValidator) {
  const Subject = `You have received new message from ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{Subject}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] shadow-lg rounded my-[40px] mx-auto p-[20px] max-w-[700px]">
            <Section className="my-[10px] ">
              <Img
                src={`https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q`}
                width="1920"
                height="1080"
                alt="Vercel"
                className="my-0 mx-auto object-contain w-[180px] h-[50px]"
              />
            </Section>
            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>{"Admin"}</strong>,
            </Text>
            <Text className="text-[24px] font-semibold leading-[32px] text-indigo-400">
              Qoute requested for exclusive Booking from {name}.
            </Text>
            <Text>Phone: {phone}</Text>
            <Text>Email: {email}</Text>
            <Text>Phone: {phone}</Text>
            <Text>Date: {selectedDate}</Text>
            <Text>Event Type: {eventType}</Text>
            <Text>Duration: {Duration}</Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
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
}
