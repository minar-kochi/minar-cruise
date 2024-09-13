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
}

// const domain = process.env.NEXT_PUBLIC_DOMAIN;

export default function ExclusiveBookingEmailToAdmin({
  adultCount,
  babyCount,
  childCount,
  email,
  name,
  phone,
  selectedDate,
  selectedTime,
}: ExclusiveBookingEmailToAdmin) {
  const Subject = `You have recieved new messsage fron ${name}`;
  //   name: string;
  //   email: string;
  //   phone: string;
  //   adultCount: number;
  //   childCount: number;
  //   babyCount: number;
  //   selectedDate: string;
  //   selectedTime: string;
  return (
    <Html>
      <Head />
      <Preview>{Subject}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] shadow-lg rounded my-[40px] mx-auto p-[20px] max-w-[700px]">
            <Section className="my-[10px] ">
              <Img
                src={`https://cochincruiseline.com/wp-content/uploads/2022/12/logo.png`}
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
            <Text>
              This is the actual content that the accented text above refers to.
            </Text>
            <Text>Phone: {phone}</Text>
            <Text>Email: {email}</Text>
            <Text>Phone: {phone}</Text>
            <Text>Date: {selectedDate}</Text>
            <Text>Time: {selectedTime}</Text>
            <Text>Adults: {adultCount}</Text>
            <Text>Infants: {babyCount}</Text>
            <Text>Childs: {childCount}</Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666]  text-[12px] leading-[24px] text-justify">
              This message was produced and distributed by{" "}
              <strong>Minar Cruise Services</strong>, Inc., GF,40/6185, Marine
              Drive, Ernakulam, Kerala 682031. © 2022, All rights reserved.
              Minar cruise is a registered trademark of{" "}
              {/* <Link href={domain}>{domain}</Link>, Inc. View our{" "}
                  <Link href={`${domain}/privacy-policy`}>privacy policy</Link>. */}
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

// export default ExclusiveBookingEmailToAdmin;
