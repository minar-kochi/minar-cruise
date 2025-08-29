import { Column, Heading, Row, Section, Text } from "@react-email/components";
import React from "react";
import { ThemeConfig } from "./ThemeConfig";

export default function CustomerInformation({
  BookingId,
  bookingDate,
  contact,
  customerName,
}: {
  customerName?: string;
  contact: string;
  bookingDate: string;
  BookingId?: string;
}) {
  return (
    <Section
      style={{
        backgroundColor: ThemeConfig.cardBackground,
        padding: "25px",
        borderRadius: "8px",
        marginBottom: "24px",
        boxShadow: ThemeConfig.boxShadow,
      }}
    >
      <Heading
        style={{
          fontSize: "20px",
          color: ThemeConfig.textForeground,
          margin: "0 0 16px 0",
        }}
      >
        Customer Information
      </Heading>

      <Row style={{ marginBottom: "12px" }}>
        <Column>
          <Text
            style={{
              color: ThemeConfig.textForeground,
              fontWeight: 450,
              margin: "0",
            }}
          >
            Customer Name:
          </Text>
        </Column>
        <Column align="right">
          <Text style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}>
            {customerName}
          </Text>
        </Column>
      </Row>

      <Row style={{ marginBottom: "12px" }}>
        <Column>
          <Text
            style={{
              color: ThemeConfig.textForeground,
              fontWeight: 450,
              margin: "0",
            }}
          >
            Contact:
          </Text>
        </Column>
        <Column align="right">
          <Text style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}>
            {contact}
          </Text>
        </Column>
      </Row>

      <Row>
        <Column>
          <Text
            style={{
              color: ThemeConfig.textForeground,
              fontWeight: 450,
              margin: "0",
            }}
          >
            Booking Date:
          </Text>
        </Column>
        <Column align="right">
          <Text style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}>
            {bookingDate}
          </Text>
        </Column>
      </Row>
      {BookingId ? (
        <Row>
          <Column>
            <Text
              style={{
                color: ThemeConfig.textForeground,
                fontWeight: 450,
                margin: "0",
              }}
            >
              Booking Reference:
            </Text>
          </Column>
          <Column align="right">
            <Text>
              <span
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                {BookingId}
              </span>
            </Text>
          </Column>
        </Row>
      ) : null}
    </Section>
  );
}
