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

interface NewScheduleCreatedAlertEmailProps {
  packageTitle: string;
  scheduleDate: string;
  fromTime: string;
  duration: number;
}

const domain = "minar-cruise.vercel.app";

const NewScheduleCreatedAlertEmail = ({
  packageTitle,
  scheduleDate,
  fromTime,
  duration,
}: NewScheduleCreatedAlertEmailProps) => {
  const Subject = `New Schedule Created`;

  return (
    <Html>
      <Head />
      <Preview>{Subject}</Preview>
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
            <Heading className="text-black text-[24px] font-normal text-center pt-6 my-[15px] mx-0">
              <strong>New Schedule Created </strong>
            </Heading>

            {/* <Text className="text-black text-[14px] leading-[24px] tracking-wide">
                
              </Text> */}
            <Section className="flex flex-col items-center gap-4 max-w-fit leading-5 tracking-wider">
              <Text>
                <strong className="font-bold text-lg">Package :</strong>{" "}
                {packageTitle}
              </Text>
              <Text>
                <strong className="font-bold text-lg">Date :</strong>{" "}
                {scheduleDate}
              </Text>
              <Text>
                <strong className="font-bold text-lg">Time :</strong> {fromTime}
              </Text>
              <Text>
                <strong className="font-bold text-lg">Duration :</strong>{" "}
                {duration / 60} hrs
              </Text>
            </Section>

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
};

//   BookingConfirmationEmailForAdmin.PreviewProps = {
//     packageTitle: "Sunset cruise",
//     scheduleDate: "12 sept 2024",
//     fromTime: "04 sept 2024",
//      duration: 120
//   } as NewScheduleCreatedAlertEmailProps;

export default NewScheduleCreatedAlertEmail;
