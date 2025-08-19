import { Column, Img, Row, Section, Text } from "@react-email/components";
import React from "react";
import { ThemeConfig } from "./ThemeConfig";

export default function HeaderSection() {
  return (
    <Section style={{ marginBottom: "32px" }}>
      <Row>
        <Column>
          <Img
            src={`https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q`}
            width="200"
            height="60"
            alt="Minar Cruise Logo"
            style={{
              width: "135px",
              height: "29px",
            }}
          />
          <Text
            style={{
              fontSize: "14px",
              color: "#475569",
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
              color: ThemeConfig.textMuted,
              margin: "0 0 4px 0",
              fontWeight: 500
            }}
          >
            📞 +91 8089021666
          </Text>
          <Text style={{ fontSize: "14px", color: ThemeConfig.textMuted, margin: "0", fontWeight: 500 }}>
            ✉️ info@cochincruiseline.com
          </Text>
        </Column>
      </Row>
    </Section>
  );
}
