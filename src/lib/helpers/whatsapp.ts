import { z } from "zod";
import { sendConfirmationEmail } from "./resend";
import AdminGenericEmail from "@/components/services/AdminErrorEmail";
import { render } from "@react-email/components";

export async function SendMessageViaWhatsapp({
  recipientNumber,
  message,
  temp,
}: {
  recipientNumber: string;
  message?: string;
  temp?: {
    allow: boolean;
    FromEmail: string;
    subject: string;
    Emailheading: string;
    error: boolean;
  };
}) {
  let ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN;
  let isWhatsAppEnabled = process.env.WHATS_APP_ENABLE;

  if (!isWhatsAppEnabled && !temp) {
    return null;
  }
  try {
    if (!message) return;
    if (temp && temp.allow) {
      let { FromEmail, allow, error, subject, Emailheading } = temp;
      await sendConfirmationEmail({
        emailSubject: temp.subject,
        fromEmail: temp.FromEmail!,
        recipientEmail: process.env.ADMIN_EMAIL!,
        emailComponent: AdminGenericEmail({
          message,
          error,
          heading: Emailheading,
          subject,
        }),
      });
    }
    return;
  } catch (error) {
    return;
  }

  try {
    console.log("Called Send Message \n", message);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `${recipientNumber}`,
      preview_url: "true",
      type: "text",
      text: {
        preview_url: true,
        body: message,
      },
    });
    let data = await fetch(
      "https://graph.facebook.com/v20.0/427706937087618/messages",
      {
        body: raw,
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      },
    )
      .then((response) => response.text())
      .then((result) => result)
      .catch((error) => console.error(error));
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
