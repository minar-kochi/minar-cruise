import { $Enums } from "@prisma/client";
import { PaymentEntity } from "./razer-pay-order-paid.types";

export type SCHEDULE_TIME_NOT_FOUND_PAYLOAD = {
  scheduleTime: $Enums.PACKAGE_CATEGORY | string; // its a string
  packageTitle: string;
  date: string;
  adultCount: string;
  babyCount: string;
  childCount: string;
  email: string;
  name: string;
  contact: string;
  RazerPayEventId: string;
  eventId: string;
};

export type UNKNOWN_NOTES_EVENT = {
  eventId: string;
  eventFailedCount: string | number;
  paymentEntity: PaymentEntity;
};

type TReceiver = "system" | "dev" | "admin" | "booking";

export type SCHEDULE_NOT_FOUND_EMAIL = {
  type: "SCHEDULE_TIME_NOT_FOUND";
  receiver: TReceiver[];
  payload: SCHEDULE_TIME_NOT_FOUND_PAYLOAD;
};
export type SCHEDULE_PACKAGE_CONFLICTS_EMAIL = {
  type: "SCHEDULE_PACKAGE_CONFLICTS";
  receiver: TReceiver[];
  payload: SCHEDULE_TIME_NOT_FOUND_PAYLOAD & {
    conflictedPackageTitle: string;
  };
};

export type FAILED_TO_CREATE_BOOKING_EMAIL = {
  type: "FAILED_TO_CREATE_BOOKING";
  receiver: TReceiver[];
  payload: SCHEDULE_TIME_NOT_FOUND_PAYLOAD;
};

export type UNKNOWN_NOTES_EVENT_EMAIL = {
  type: "UNKNOWN_NOTES_EVENT";
  receiver: TReceiver[];
  payload: UNKNOWN_NOTES_EVENT;
};

export type TEmail =
  | SCHEDULE_NOT_FOUND_EMAIL
  | SCHEDULE_PACKAGE_CONFLICTS_EMAIL
  | UNKNOWN_NOTES_EVENT_EMAIL
  | FAILED_TO_CREATE_BOOKING_EMAIL;
