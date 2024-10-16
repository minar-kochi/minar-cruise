export type TSubCodes =
  | "SCHEDULE_CONFLICT_WITH_PACKAGE"
  | "TIME_WAS_OVERDUED"
  | "UNKNOWN";
export const subCodeArray: TSubCodes[] = [
  "SCHEDULE_CONFLICT_WITH_PACKAGE",
  "TIME_WAS_OVERDUED",
  "UNKNOWN",
];
export type ScheduleConflictError = {
  title: string | null;
  slug: string | null;
} & ErrorMessage;

export type ErrorMessage = {
  message: string;
  subCode: TSubCodes;
};
