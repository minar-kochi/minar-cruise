import { TEventType } from "@/Types/razorpay/type";

export function getEvents(
  event: string,
): TEventType["schedule.create"] | TEventType["schedule.existing"] | "UNKNOWN" {
  if (event === "schedule.create") {
    return "schedule.create";
  }
  if (event === "schedule.existing") {
    return "schedule.existing";
  }

  return "UNKNOWN";
}

export function getDescription() {
  return "Online Payment";
}

export function getFatalityCount() {}
