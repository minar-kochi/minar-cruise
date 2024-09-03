import { z } from "zod";

export async function SendMessageViaWhatsapp({
  messageTemplate = "hello_world",
  recipientNumber,
}: {
  messageTemplate?: string;
  recipientNumber: number;
}) {
  let ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN;
  
  try {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${ACCESS_TOKEN}`,
    );
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      messaging_product: "whatsapp",
      to: `${recipientNumber}`,
      type: "template",
      template: {
        name: `${messageTemplate}`,
        language: {
          code: "en_US",
        },
      },
    });


    let data = fetch(
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
      return data

  } catch (error) {
    console.log(error);
  }
}
