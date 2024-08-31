import { db } from "@/db";

export type OrderPaidEventErrorCode = "UNKNOWN_ERROR" | "NOT_IMPLIMENTED" | "BOOKING_CREATE_FAILED";

export class OrderPaidEventError extends Error {
  readonly code: OrderPaidEventErrorCode;
  readonly fatal: boolean = false;
  constructor({
    code,
    fatality: { fatal = false, message = "" },
  }: {
    code: OrderPaidEventErrorCode;
    fatality: {
      fatal?: boolean;
      message?: string;
    };
  }) {
    super();
    this.code = code;
    this.fatal = fatal;
  }
}
