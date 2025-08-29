import { Section, Text } from "@react-email/components";
import { ThemeConfig } from "./ThemeConfig";
import { TermsAndConditions as termsAndConditions } from "@/components/admin/dashboard/ticket/doc-helper";

export default function TermsAndConditions() {
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
      <Text
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: ThemeConfig.textForeground,
          textDecoration: "underline",
        }}
      >
        Terms and conditions
      </Text>
      <div
        style={{
          color: ThemeConfig.textForeground,
          fontWeight: 600,
          fontSize: "12px",
          width: "100%",
        }}
      >
        {termsAndConditions.map((item, index) => (
          <Text
            style={{
              fontWeight: 450,
            }}
            key={`${index}-${item}`}
          >
            - {item}
          </Text>
        ))}
      </div>
    </Section>
  );
}
