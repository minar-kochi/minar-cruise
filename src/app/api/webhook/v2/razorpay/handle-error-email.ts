import { sendConfirmationEmail } from "@/lib/helpers/resend";
import { packageScheduleConflictEmailTemplate } from "./package-schedule-conflict-email";
import { TEmail } from "./system-send-email";
import { bookingFailureEmailTemplate } from "./booking-failure-email-template";
import { scheduleConflictEmailTemplate } from "./schedule-not-found-or-conflicted-email";
import { ContaminatedNotesEmailTemplate } from "./notes-not-known";

type THandleErrorEmail = {
  emailPayload: TEmail;
};
export async function handleErrorEmail({ emailPayload }: THandleErrorEmail) {
  const emails = getReceiverEmail({ emailPayload });
  switch (emailPayload.type) {
    case "SCHEDULE_TIME_NOT_FOUND": {
      await sendConfirmationEmail({
        emailSubject: "🚨[MINAR:ERROR]: Schedule time is conflicted.",
        recipientEmail: emails,
        emailComponent: scheduleConflictEmailTemplate({
          ...emailPayload.payload,
        }),
      });
      break;
    }
    case "FAILED_TO_CREATE_BOOKING": {
      await sendConfirmationEmail({
        emailSubject: "🚨[MINAR:ERROR]: Failed to create Booking.",
        recipientEmail: emails,
        emailComponent: bookingFailureEmailTemplate({
          ...emailPayload.payload,
        }),
      });
      break;
    }
    case "SCHEDULE_PACKAGE_CONFLICTS": {
      // await packageScheduleConflictEmailTemplate
      await sendConfirmationEmail({
        emailSubject: "🚨[MINAR:ERROR]: Schedule package is conflicted.",
        recipientEmail: emails,
        emailComponent: packageScheduleConflictEmailTemplate({
          ...emailPayload.payload,
        }),
      });
      break;
    }
    case "UNKNOWN_NOTES_EVENT": {
      await sendConfirmationEmail({
        emailSubject: "🚨[MINAR:ERROR]: Notes Contaminated or invalid.",
        recipientEmail: emails,
        emailComponent: ContaminatedNotesEmailTemplate({
          ...emailPayload.payload,
        }),
      });
      break;
    }
  }
}
export function getReceiverEmail({ emailPayload }: THandleErrorEmail) {
  const receiver = emailPayload.receiver;
  const emails: string[] = [];

  if (receiver.includes("admin") && process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    emails.push(process.env.NEXT_PUBLIC_ADMIN_EMAIL);
  }

  if (receiver.includes("booking") && process.env.NEXT_PUBLIC_BOOKING_EMAIL) {
    emails.push(process.env.NEXT_PUBLIC_BOOKING_EMAIL);
  }

  if (receiver.includes("system") && process.env.NEXT_PUBLIC_SYSTEM_EMAIL) {
    emails.push(process.env.NEXT_PUBLIC_SYSTEM_EMAIL);
  }

  if (receiver.includes("dev") && process.env.DEV_EMAIL) {
    emails.push(process.env.DEV_EMAIL);
  }

  return emails;
}
