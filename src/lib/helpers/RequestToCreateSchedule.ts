import { TEventType } from "@/Types/razorpay/type";

export function decideCreateOrExisting(
  scheduleId: string | undefined,
): TEventType["schedule.create"] | TEventType["schedule.existing"] {
  if (!scheduleId) return "schedule.create";

  return "schedule.existing";
}
