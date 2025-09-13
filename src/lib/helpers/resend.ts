import { render } from "@react-email/components";
import nodemailer from "nodemailer";

type TSendConfirmationEmail = {
  fromEmail?: string;
  emailSubject: string;
  recipientEmail: string | string[];
  emailComponent: JSX.Element;
};

export async function sendConfirmationEmail({
  emailSubject,
  recipientEmail,
  emailComponent,
  fromEmail,
}: TSendConfirmationEmail) {
  try {
    const { BUSINESS_EMAIL } = process.env;
    if (!BUSINESS_EMAIL) {
      return { error: "Business email not found" };
    }
    const renderedHtml = await render(emailComponent);
    const data = await sendNodeMailerEmail({
      subject: emailSubject,
      toEmail: recipientEmail,
      fromEmail: fromEmail ?? BUSINESS_EMAIL,
      reactEmailComponent: renderedHtml,
    });
    return data;
  } catch (error) {
    return null;
  }
}

type TSendEmail = {
  subject: string;
  fromEmail?: string;
  toEmail: string | string[];
  reactEmailComponent: JSX.Element | string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendNodeMailerEmail({
  reactEmailComponent,
  subject,
  toEmail,
  fromEmail,
  maxRetries = 2,
  baseDelay = 1000,
}: TSendEmail & { maxRetries?: number; baseDelay?: number }) {
  if (typeof reactEmailComponent !== "string") return null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const data = await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: reactEmailComponent,
      });
      return data;
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed:`, error);

      // If this was the last attempt, return null
      if (attempt === maxRetries) {
        console.log(`All ${maxRetries + 1} attempts failed`);
        return null;
      }

      // Wait before retrying (exponential backoff)
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
