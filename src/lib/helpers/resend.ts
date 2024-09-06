import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type TSendConfirmationEmail = {
  fromEmail?: string;
  emailSubject?: string;
  recipientEmail: string;
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
    const { data, error } = await resend.emails.send({
      from: fromEmail ?? BUSINESS_EMAIL,
      to: [recipientEmail],
      subject: emailSubject ?? "Booking Confirmed!",
      react: emailComponent,
    });

    console.log(data);
    console.log(error);

    if (error) {
      return { error };
    }
    return data;
  } catch (error) {
    return { error };
  }
}
