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

interface AdminGenericEmail {
  message: React.ReactNode;
  error: boolean;
  subject: string;
  heading: string;
}

// const domain = process.env.NEXT_PUBLIC_DOMAIN;

export default function AdminGenericEmail({
  message,
  error,
  subject,
  heading,
}: AdminGenericEmail) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] shadow-lg rounded my-[40px] mx-auto p-[20px] max-w-[700px]">
            <Section className="my-[10px] ">
              <Img
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/assets/logo.png`}
                width="1920"
                height="1080"
                alt="Vercel"
                className="my-0 mx-auto object-contain w-[180px] h-[50px]"
              />
            </Section>
            <Heading
              className={cn(
                "text-[24px] font-normal text-center p-0 my-[15px] mx-0",
                {
                  "text-red-600": error,
                },
              )}
            >
              <strong>{heading}</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
              Dear <strong>{"Admin"}</strong>,
            </Text>

            <Text>Message:</Text>
            <Text>{message}</Text>
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

//   BookingConfirmation.PreviewProps = {
//     BookingId: "2544351",
//     totalCount: 5,
//     packageTitle: "Dinner Cruise",
//     Name: "Amjus",
//     email: "amsj@mailc.com",
//     phone: "954853212",
//     scheduleDate: "12-sep-24",
//     totalAmount: 7820,
//     BookingDate: "22/4/24",
//     adultCount: 2,
//     childCount: 5,
//     babyCount: 5
//   } as BookingConfirmationProps;

// export default AdminGenericEmail;
