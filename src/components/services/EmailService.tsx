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

interface BookingConfirmationEmailForUserProps {
  customerName?: string;
  packageTitle: string;
  contact: string;
  adult: number;
  child: number;
  infant: number;
  date?: string;
  bookingDate: string;
  boardingTime: string;
  BookingId?: string;
  status: string;
  totalAmount: number;
}

export const BookingConfirmationEmailForUser = ({
  customerName,
  date,
  packageTitle,
  BookingId,
  totalAmount,
  status,
  adult,
  boardingTime,
  bookingDate,
  child,
  contact,
  infant,
}: BookingConfirmationEmailForUserProps) => {
  // const Subject = `Booking Confirmation - ${BookingId}`;
  // const isConfirmed = status?.toLowerCase() === "confirmed";
  // const isPending = status?.toLowerCase() === "pending";

  const totalPassengers = adult + child + infant;

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
        >
          {/* Header Section */}
          <Section style={{ marginBottom: "32px" }}>
            <Row>
              <Column>
                <Img
                  src={`https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q`}
                  width="200"
                  height="60"
                  alt="Minar Cruise Logo"
                  style={{
                    width: "180px",
                    height: "40px",
                  }}
                />
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0",
                    fontWeight: 500,
                  }}
                >
                  Your journey begins with us!
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 4px 0",
                  }}
                >
                  📞 +91 8089021666
                </Text>
                <Text
                  style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}
                >
                  ✉️ info@cochincruiseline.com
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Confirmation Header */}
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Heading
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "green",
                margin: "0 0 8px 0",
              }}
            >
              Booking {status}!
            </Heading>
            <Text style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
              Thank you for choosing us for your travel adventure
            </Text>
          </Section>

          {/* Customer Information Section */}
          <Section
            style={{
              backgroundColor: "#f1f5f9",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Heading
              style={{
                fontSize: "18px",
                color: "#059669",
                margin: "0 0 16px 0",
              }}
            >
              Customer Information
            </Heading>

            <Row style={{ marginBottom: "12px" }}>
              <Column>
                <Text style={{ color: "#6b7280", margin: "0" }}>
                  Customer Name:
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}
                >
                  {customerName}
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "12px" }}>
              <Column>
                <Text style={{ color: "#6b7280", margin: "0" }}>Contact:</Text>
              </Column>
              <Column align="right">
                <Text
                  style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}
                >
                  {contact}
                </Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Text style={{ color: "#6b7280", margin: "0" }}>
                  Booking Date:
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}
                >
                  {bookingDate}
                </Text>
              </Column>
            </Row>
            {BookingId ? (
              <Row>
                <Column>
                  <Text style={{ color: "#6b7280", margin: "0" }}>
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

          {/* Trip Details Section */}
          <Section
            style={{
              backgroundColor: "#f1f5f9",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Heading
              style={{
                fontSize: "20px",
                color: "#059669",
                margin: "0 0 16px 0",
              }}
            >
              Trip Details
            </Heading>

            <Heading
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#10b981",
                margin: "0 0 16px 0",
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

            <Row style={{ marginBottom: "16px" }}>
              <Column>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {/* <span style={{ fontSize: "20px" }}></span> */}
                  <div>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      <span>📅 </span>Journey Date
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: "#1f2937",
                        margin: "0",
                      }}
                    >
                      {date}
                    </Text>
                  </div>
                </div>
              </Column>
              <Column>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {/* <span style={{ fontSize: "20px" }}>🕐</span> */}
                  <div>
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      <span>🕐 </span>Boarding Time
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: "#1f2937",
                        margin: "0",
                      }}
                    >
                      {boardingTime}
                    </Text>
                  </div>
                </div>
              </Column>
            </Row>

            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #e2e8f0",
                margin: "16px 0",
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>👥</span>
              <div style={{ flex: "1" }}>
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 8px 0",
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
                  }}
                >
                  {/* {adult > 0 && ( */}
                  <span
                    style={{
                      border: "1px solid #d1d5db",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    {adult} Adult
                    {adult > 1 ? "s" : ""}
                  </span>
                  {/* )} */}
                  {/* {child > 0 && ( */}
                  <span
                    style={{
                      border: "1px solid #d1d5db",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    {child} Child
                    {child > 1 ? "ren" : ""}
                  </span>
                  {/* )} */}
                  {/* {infant > 0 && ( */}
                  <span
                    style={{
                      border: "1px solid #d1d5db",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    {infant} Infant
                    {infant > 1 ? "s" : ""}
                  </span>
                  {/* )} */}
                </div>
                <Text
                  style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}
                >
                  Total Passengers:{" "}
                  <span style={{ fontWeight: "600", color: "#1f2937" }}>
                    {totalPassengers}
                  </span>
                </Text>
              </div>
            </div>
          </Section>

          {/* Payment Summary Section */}
          <Section
            style={{
              backgroundColor: "#f1f5f9",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "32px",
            }}
          >
            <Heading
              style={{
                fontSize: "18px",
                color: "#059669",
                margin: "0 0 16px 0",
              }}
            >
              Payment Summary
            </Heading>

            <Row style={{ marginBottom: "12px" }}>
              <Column>
                <Text style={{ color: "#6b7280", margin: "0" }}>
                  Package Cost:
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ color: "#1f2937", margin: "0" }}>
                  ${totalAmount.toFixed(2)}
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
                    color: "#1f2937",
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
                    fontWeight: "bold",
                    color: "#10b981",
                    margin: "0",
                  }}
                >
                  ${totalAmount.toFixed(2)}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Footer Section */}
          <Section
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "24px",
              textAlign: "center",
            }}
          >
            <Tailwind>
              <Section className="px-8 pb-8">
                <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                  Thank you for choosing <strong>Minar Cruise</strong>.
                  We&apos;re committed to making your experience memorable and
                  enjoyable. For any questions or assistance, please don&apos;t
                  hesitate to{" "}
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`}
                    className="text-blue-600 underline"
                  >
                    contact our team
                  </Link>
                  .
                </Text>
              </Section>
            </Tailwind>

            <Tailwind>
              <Text className="text-gray-500 text-xs leading-relaxed">
                This message was sent by <strong>Minar Cruise Services</strong>,
                Inc.
                <br />
                GF, 40/6185, Marine Drive, Ernakulam, Kerala 682031
                <br />© 2024 All rights reserved. Minar Cruise is a registered
                trademark of{" "}
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
            </Tailwind>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmailForUser;
