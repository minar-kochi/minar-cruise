import {
  Column,
  Heading,
  Hr,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

export default function FooterSection() {
  return (
    <Section
      style={{
        borderTop: "1px solid #e2e8f0",
        paddingTop: "24px",
        textAlign: "center",
      }}
    >
      
      <Section className="px-8 pb-8">
        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
          Thank you for choosing <strong>Minar Cruise</strong>. We&apos;re
          committed to making your experience memorable and enjoyable. For any
          questions or assistance, please don&apos;t hesitate to{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`}
            className="text-blue-600 underline"
          >
            contact our team
          </Link>
          .
        </Text>
      </Section>

      <Text className="text-gray-500 text-xs leading-relaxed">
        This message was sent by <strong>Minar Cruise Services</strong>, Inc.
        <br />
        GF, 40/6185, Marine Drive, Ernakulam, Kerala 682031
        <br />© 2024 All rights reserved. Minar Cruise is a registered trademark
        of{" "}
        <Link
          href={process.env.NEXT_PUBLIC_DOMAIN}
          className="text-blue-600 underline"
        >
          {process.env.NEXT_PUBLIC_DOMAIN}
        </Link>
        <br />
        <Link
          href={`${process.env.NEXT_PUBLIC_DOMAIN}/privacy-policy`}
          className="text-blue-600 underline"
        >
          Privacy Policy
        </Link>
      </Text>
    </Section>
  );
}
