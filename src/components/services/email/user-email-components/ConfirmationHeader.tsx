import { Heading, Section, Text } from "@react-email/components";
import React from "react";
import { ThemeConfig } from "./ThemeConfig";

export default function ConfirmationHeader({ status }: { status: string }) {
  return (
    <Section style={{ textAlign: "center", marginBottom: "42px",marginTop: "38px" }}>
      <Heading
        style={{
          fontSize: "32px",
          fontWeight: 900,
          color: ThemeConfig.textForeground,
          margin: "0 0 8px 0",
          textTransform: "capitalize"
        }}
      >
        Booking {status}!
      </Heading>
      <Text
        style={{
          fontSize: "16px",
          color: ThemeConfig.textMuted,
          margin: "0",
          fontWeight: 500,
        }}
      >
        Thank you for choosing us for your travel adventure
      </Text>
    </Section>
  );
}
