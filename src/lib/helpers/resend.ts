import { render } from "@react-email/components";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
  const { BUSINESS_EMAIL } = process.env;
  if (!BUSINESS_EMAIL) {
    return { error: "Business email not found" };
  }
  try {
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
  fromEmail?: string 
  toEmail: string | string[];
  reactEmailComponent: JSX.Element | string;
};

// export async function sendEmail({
//   fromEmail,
//   reactEmailComponent,
//   subject,
//   toEmail,
// }: TSendEmail) {
//   const { BUSINESS_EMAIL } = process.env;
//   if (!BUSINESS_EMAIL) {
//     return { error: "Business email not found" };
//   }

//   try {
//     const { data, error } = await resend.emails.send({
//       from: fromEmail ?? BUSINESS_EMAIL,
//       to: [toEmail],
//       subject,
//       react: reactEmailComponent,
//     });

//     if (error) {
//       return { error };
//     }

//     return data;
//   } catch (error) {
//     return { error };
//   }
// }

export async function sendNodeMailerEmail({
  reactEmailComponent,
  subject,
  toEmail,
  fromEmail,
}: TSendEmail) {
  // const data = await render(BookingConfirmationEmailForAdmin({}));
  if (typeof reactEmailComponent !== "string") return null;
  try {
    const data = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: reactEmailComponent,
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
