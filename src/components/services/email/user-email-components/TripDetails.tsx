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

export default function TripDetails({
  boardingTime,
  date,
  packageTitle,
  adult,
  child,
  infant,
}: {
  packageTitle: string;
  date?: string;
  boardingTime: string;
  adult: number;
  child: number;
  infant: number;
}) {
  const totalPassengers = adult + child + infant;
  return (
    <Section
      style={{
        backgroundColor: ThemeConfig.cardBackground,
        boxShadow: ThemeConfig.boxShadow,
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "24px",
      }}
    >
      <Heading
        style={{
          fontSize: "20px",
          color: ThemeConfig.textForeground,
          margin: "0 0 16px 0",
        }}
      >
        Trip Details
      </Heading>

      <Heading
        style={{
          fontSize: "18px",
          fontWeight: "800",
          color: ThemeConfig.textForeground,
          margin: "0 0 16px 0",
          paddingTop: "20px",
        }}
      >
        {packageTitle}
      </Heading>

      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e2e8f0",
          margin: "16px 0",
        }}
      />

      <TripDetailsRow Key="Journey Date" value={date} icon="📅" />
      <TripDetailsRow Key="Departure Time" value={boardingTime} icon="🚢" />
      <TripDetailsRow
        Key="Boarding Time"
        value={"30 minutes before departure time"}
        icon="🕐"
      />

      <Hr
        style={{
          border: "none",
          borderTop: "1px solid #e2e8f0",
          margin: "16px 0",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "20px" }}>👥</span>
        <div style={{ flex: "1", marginLeft: "6px" }}>
          <Text
            style={{
              fontSize: "14px",
              color: ThemeConfig.textForeground,
              margin: "0 0 8px 0",
              fontWeight: "450",
            }}
          >
            Passenger Details
          </Text>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "8px",
              fontWeight: "500",
              color: ThemeConfig.textForeground,
            }}
          >
            <span
              style={{
                border: "1px solid #d1d5db",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: ThemeConfig.cardBackground,
                marginLeft: "2px",
                marginRight: "2px",
              }}
            >
              {adult} Adult
              {adult > 1 ? "s" : ""}
            </span>
            <span
              style={{
                border: "1px solid #d1d5db",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: ThemeConfig.cardBackground,
                marginLeft: "2px",
                marginRight: "2px",
              }}
            >
              {child} Child
              {child > 1 ? "ren" : ""}
            </span>
            <span
              style={{
                border: "1px solid #d1d5db",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: ThemeConfig.cardBackground,
                marginLeft: "2px",
                marginRight: "2px",
              }}
            >
              {infant} Infant
              {infant > 1 ? "s" : ""}
            </span>
          </div>
          <Text
            style={{
              fontSize: "14px",
              color: ThemeConfig.textForeground,
              fontWeight: "450",
              margin: "0",
            }}
          >
            Total Passengers:{" "}
            <span
              style={{ fontWeight: "600", color: ThemeConfig.textForeground }}
            >
              {" "}
              {totalPassengers}
            </span>
          </Text>
        </div>
      </div>
    </Section>
  );
}

function TripDetailsRow({
  Key,
  value,
  icon,
}: {
  Key: string;
  value?: string;
  icon: string;
}) {
  return (
    <Row style={{ marginBottom: "16px" }}>
      <Column>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "20px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            >
              {icon}
            </span>
          </div>
          <div
            style={{
              marginLeft: "6px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: ThemeConfig.textForeground,
                margin: "0 0 4px 0",
                fontWeight: "450",
              }}
            >
              {Key}
            </Text>
            <Text
              style={{
                fontWeight: "600",
                color: ThemeConfig.textForeground,
                margin: "0",
              }}
            >
              {value}
            </Text>
          </div>
        </div>
      </Column>
    </Row>
  );
}
