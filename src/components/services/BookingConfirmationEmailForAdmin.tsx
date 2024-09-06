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
  
  interface BookingConfirmationEmailForAdmin {
    BookingId: string;
    totalCount: number;
    packageTitle: string;
    Name: string;
    email: string;
    phone: string;
    totalAmount: number;
    scheduleDate: string;
    BookingDate: string;
    Duration: number
  }
  
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  
  const BookingConfirmationEmailForAdmin = ({
    Name,
    email,
    packageTitle,
    phone,
    scheduleDate,
    totalAmount,
    totalCount,
    BookingId,
    BookingDate,
    Duration
  }: BookingConfirmationEmailForAdmin) => {
    const Subject = `New Booking Confirmation! for ${packageTitle} on ${scheduleDate}`;
  
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
              {/* <Heading className="text-black text-[24px] font-normal text-center p-0 my-[15px] mx-0">
                  <strong>{Title} !</strong>
                </Heading> */}
              <Text className="text-black text-[14px] leading-[24px] pt-[30px]">
                Dear <strong>{"Admin"}</strong>,
              </Text>
              <Text className="text-black text-[14px] leading-[24px] tracking-wide">
                We are pleased to inform you of a <strong>New booking</strong> for{" "}
                <strong>{packageTitle}</strong> on <strong>{scheduleDate}</strong> {" "}
                the upcoming cruise with <strong>
                  Booking ID: #{BookingId}
                </strong>{" "}
                . Below are the details of your upcoming event:
              </Text>
              <div className="pt-[20px]">
                <strong className="text-xl font-sans font-black">
                  Booking Details :-
                </strong>
  
                <ul className="pl-5 list-outside grid grid-cols-2">
                  <li className=" pl-0 font-sans tracking-wide">
                    <Text>
                      <strong>Name - </strong> {Name}
                    </Text>
                  </li>
                  <li className=" pl-0 font-sans tracking-wide">
                    <Text>
                      <strong>Email - </strong>
                      {email}
                    </Text>
                  </li>
                  <li className=" pl-0 font-sans tracking-wide">
                    <Text>
                      <strong>Phone - </strong> {phone}
                    </Text>
                  </li>
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
                      <strong>Total - </strong> {totalAmount}
                    </Text>
                  </li>
                  <li className=" pl-0 font-sans tracking-wide">
                    <Text>
                      <strong>Booking Date</strong> {BookingDate}
                    </Text>
                  </li>
                  <li className=" pl-0 font-sans tracking-wide">
                    <Text>
                      <strong>Duration</strong> {Duration/60} hrs
                    </Text>
                  </li>
                  
                </ul>
              </div>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#666666]  text-[12px] leading-[24px] text-justify">
                This message was produced and distributed by{" "}
                <strong>Minar Cruise Services</strong>, Inc., GF,40/6185, Marine
                Drive, Ernakulam, Kerala 682031. © 2022, All rights reserved.
                Minar cruise is a registered trademark of{" "}
                <Link href={domain}>{domain}</Link>, Inc. View our{" "}
                <Link href={`${domain}/privacy-policy`}>privacy policy</Link>.
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
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
//      Duration: 120
//   } as BookingConfirmationProps;
  
  export default BookingConfirmationEmailForAdmin;
  
  