import { TEventType } from "@/Types/razorpay/type";

export function getEvents(
  event: string,
):
| TEventType["schedule.create"]
| TEventType["schedule.create.sunset"]
| TEventType["schedule.existing"]
  | "UNKNOWN" {
  if (event === "schedule.create") {
    return "schedule.create";
  }
  if (event === "schedule.existing") {
    return "schedule.existing";
  }
  if (event === "schedule.create.sunset") {
    return "schedule.create.sunset";
  }
  return "UNKNOWN";
}

export function getDescription() {
  return "Online Payment";
}

export function getFatalityCount() {}
