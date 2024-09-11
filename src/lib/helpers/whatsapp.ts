import { z } from "zod";

export async function SendMessageViaWhatsapp({
  recipientNumber,
  message,
}: {
  recipientNumber: string;
  message?: string;
}) {
  let ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN;
  let isWhatsAppEnabled = process.env.WHATS_APP_ENABLE;

  if (!isWhatsAppEnabled) {
    return null;
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
