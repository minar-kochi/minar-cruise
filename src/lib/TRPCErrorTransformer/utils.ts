import {
  ScheduleConflictError,
  subCodeArray,
} from "@/Types/Schedule/ScheduleConflictError";

export function parseJSON(data: string) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export function ParseScheduleConflicError(
  params: string,
): ScheduleConflictError | null {
  try {
    const data = parseJSON(params);
    if (!data) return null;

    const subCode =
      subCodeArray.find((fv) => fv === data.subCodes) ?? "UNKNOWN";

    return {
      title: data.title ?? null,
      slug: data.slug ?? null,
      message: data.message ?? "Something unexpected happenedF",
      subCode,
    };
  } catch (error) {
    return null;
  }
}
