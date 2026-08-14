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
  baseAmount,
  gstRate,
  gstAmount,
  amountPaid,
  balanceDue,
}: {
  totalAmount: number;
  baseAmount?: number;
  gstRate?: number;
  gstAmount?: number;
  /** Collected now. Omit for fully-paid bookings. */
  amountPaid?: number;
  /** Collected offline on the day. Omit or 0 hides the split entirely. */
  balanceDue?: number;
}) {
  const hasGST = gstAmount !== undefined && gstAmount > 0;
  // Only part-paid bookings show a split; everything else renders as before.
  const isPartPaid = (balanceDue ?? 0) > 0 && amountPaid !== undefined;

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

      {hasGST ? (
        <>
          <Row style={{ marginBottom: "8px" }}>
            <Column>
              <Text
                style={{
                  color: ThemeConfig.textForeground,
                  margin: "0",
                  fontWeight: 450,
                }}
              >
                Base Fare:
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
                ₹{(baseAmount ?? 0).toFixed(2)}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: "8px" }}>
            <Column>
              <Text
                style={{
                  color: ThemeConfig.textForeground,
                  margin: "0",
                  fontWeight: 450,
                }}
              >
                GST ({gstRate ?? 0}%):
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
                ₹{(gstAmount ?? 0).toFixed(2)}
              </Text>
            </Column>
          </Row>
        </>
      ) : (
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
      )}

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
            Total Amount{hasGST ? " (incl. GST)" : ""}:
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

      {isPartPaid && (
        <>
          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #e2e8f0",
              margin: "12px 0",
            }}
          />

          <Row style={{ marginBottom: "8px" }}>
            <Column>
              <Text
                style={{
                  color: ThemeConfig.textForeground,
                  margin: "0",
                  fontWeight: 450,
                }}
              >
                Paid Now:
              </Text>
            </Column>
            <Column align="right">
              <Text
                style={{
                  fontWeight: 700,
                  color: ThemeConfig.textForeground,
                  margin: "0",
                }}
              >
                ₹{amountPaid}
              </Text>
            </Column>
          </Row>

          <Row>
            <Column>
              <Text
                style={{
                  color: ThemeConfig.textForeground,
                  margin: "0",
                  fontWeight: 450,
                }}
              >
                Balance Due (at boarding):
              </Text>
            </Column>
            <Column align="right">
              <Text
                style={{
                  fontWeight: 700,
                  color: ThemeConfig.textForeground,
                  margin: "0",
                }}
              >
                ₹{balanceDue}
              </Text>
            </Column>
          </Row>
        </>
      )}
    </Section>
  );
}
