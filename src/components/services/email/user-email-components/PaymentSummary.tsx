import {
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from "@react-email/components";
import React from "react";
import { ThemeConfig } from "./ThemeConfig";

export default function PaymentSummary({
  totalAmount,
}: {
  totalAmount: number;
}) {
  return (
    <Section
      style={{
        backgroundColor: ThemeConfig.cardBackground,
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "32px",
        boxShadow: ThemeConfig.boxShadow,
      }}
    >
      <Heading
        style={{
          fontSize: "18px",
          color: ThemeConfig.textForeground,
          margin: "0 0 16px 0",
        }}
      >
        Payment Summary
      </Heading>

      <Row style={{ marginBottom: "12px" }}>
        <Column>
          <Text
            style={{
              color: ThemeConfig.textForeground,
              margin: "0",
              fontWeight: 450,
            }}
          >
            Package Cost:
          </Text>
        </Column>

        <Column align="right">
          <Text
            style={{
              fontWeight: 450,
              color: ThemeConfig.textForeground,
              margin: "0",
            }}
          >
            ₹{totalAmount.toFixed(2)}
          </Text>
        </Column>
      </Row>

      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e2e8f0",
          margin: "12px 0",
        }}
      />

      <Row>
        <Column>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: ThemeConfig.textForeground,
              margin: "0",
            }}
          >
            Total Amount:
          </Text>
        </Column>
        <Column align="right">
          <Text
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: ThemeConfig.textForeground,
              margin: "0",
            }}
          >
            ₹{totalAmount}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}
