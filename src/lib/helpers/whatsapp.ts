import { z } from "zod";
import { sendConfirmationEmail } from "./resend";
import AdminErrorEmail from "@/components/services/AdminErrorEmail";
import { render } from "@react-email/components";

export async function SendMessageViaWhatsapp({
  recipientNumber,
  message,
  error = false,
}: {
  recipientNumber: string;
  message?: string;
  error: boolean;
}) {
  let ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN;
  let isWhatsAppEnabled = process.env.WHATS_APP_ENABLE;

  if (!isWhatsAppEnabled && !error) {
    return null;
  }
  try {
    if (!message) return;
    await sendConfirmationEmail({
      emailSubject: "URGENT: Something went wrong while processing booking",
      fromEmail: process.env.NEXT_PUBLIC_ERROR_EMAIL!,
      recipientEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      emailComponent: AdminErrorEmail({ message }),
    });

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
