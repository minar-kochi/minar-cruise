import { TEmail } from "@/app/api/webhook/v2/razorpay/system-send-email";

export type OrderPaidEventErrorCode =
  | "UNKNOWN_ERROR"
  | "NOT_IMPLIMENTED"
  | "BOOKING_CREATE_FAILED"
  | "SCHEDULE_TIME_NOT_FOUND"
  | "FAILED_CREATING_SCHEDULE_TIME"
  | "UNKNOWN_NOTES_EVENT"
  | "SCHEDULE_PACKAGE_CONFLICTS"
  | "FAILED_TO_PROCESS_ORDER";

export class OrderPaidEventError extends Error {
  readonly code: OrderPaidEventErrorCode;
  readonly fatal: boolean = false;
  readonly eventId: string = "";
  readonly payload: any | null = null;
  readonly email: boolean = false;
  readonly emailPayload: TEmail | null = null;
  // readonly message: string

  constructor({
    code,
    fatality: {
      fatal = false,
      message = "",
      payload = null,
      email = false,
      emailPayload = null,
      eventId,
    },
  }: {
    code: OrderPaidEventErrorCode;
    fatality: {
      fatal?: boolean;
      message?: string;
      payload?: any;
      email?: boolean;
      emailPayload?: TEmail | null;
      eventId: string;
    };
  }) {
    super();
    this.code = code;
    this.fatal = fatal;
    this.message = message;
    this.payload = payload;
    this.email = email;
    this.emailPayload = emailPayload;
    this.eventId = eventId;
  }
}
