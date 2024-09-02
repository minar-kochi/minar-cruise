import { isValidMergeTimeCycle } from "../utils";
import { VercelInviteUserEmail } from "@/components/services/EmailService";
import { error } from "console";
import { Resend } from "resend";

export const selectFromTimeAndToTimeFromScheduleOrPackages = ({
  Packages,
  schedule,
}: {
  schedule: {
    scheduleToTime: string | null;
    scheduleFromTime: string | null;
  };
  Packages: {
    packageToTime: string | null;
    packageFromTime: string | null;
  };
}): {
  fromTime: string;
  toTime: string;
} => {
  const { scheduleFromTime, scheduleToTime } = schedule;
  const { packageFromTime, packageToTime } = Packages;
  const isScheduleToValid = isValidMergeTimeCycle(scheduleFromTime ?? "");
  const isScheduleFromValid = isValidMergeTimeCycle(scheduleToTime ?? "");
  if (
    isScheduleToValid &&
    isScheduleFromValid &&
    scheduleFromTime &&
    scheduleToTime
  ) {
    return {
      fromTime: scheduleFromTime,
      toTime: scheduleToTime,
    };
  }
  const isPackageToValid = isValidMergeTimeCycle(packageFromTime ?? "");
  const isPackageFromValid = isValidMergeTimeCycle(packageToTime ?? "");
  if (
    isPackageToValid &&
    isPackageFromValid &&
    packageFromTime &&
    packageToTime
  ) {
    return {
      fromTime: packageFromTime,
      toTime: packageToTime,
    };
  }
  return {
    fromTime: "",
    toTime: "",
  };
};

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
  fromEmail
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

    if (error) {
      return { error };
    }

    return data;
  } catch (error) {
    return { error };
  }
}
