import { TKeyOrganized } from "@/components/admin/dashboard/Schedule/ScheduleSelector";
import { Schedule } from "@prisma/client";
import type { IstDayKey } from "@/lib/datetime";

export type TSplitedFormatedDate = {
  year: number;
  day: number;
  month: number;
};

export type TGallery = {
  Text: {
    bannerHeading: string;
    bannerQuote: string;
    description: string;
  };
  bannerImages: {
    url: string;
    alt: string;
  }[];
  allImages: {
    url: string;
    alt: string;
  }[];
};

export const Galleries = [
  "family-gathering",
  "corporate-gathering",
  "celebration-gathering",
] as const;

export type TGalleries = (typeof Galleries)[number];

/**
 * A Schedule as the admin store holds it: the calendar day as an `IstDayKey`
 * rather than a `Date`.
 *
 * That substitution is deliberate domain modelling, not a serialisation
 * workaround. `day` is a grouping key — every calendar screen indexes by it,
 * compares it and puts it in a React key — and a `YYYY-MM-DD` string compares
 * and sorts correctly by value, where a `Date` needs normalising first and
 * carries a meaningless time component.
 *
 * Everything else stays a real `Date`. superjson revives them across the tRPC
 * boundary, so there is no longer a set of columns that have to be hand-listed
 * here as strings — which is what this type used to be, and what silently
 * drifted every time a Date column was added.
 */
export type TScheduleDataDayReplaceString = Omit<Schedule, "day"> & {
  day: IstDayKey;
};

export type TScheduleSelector = {
  type: TKeyOrganized;
};
export type TMeridianCycle = "AM" | "PM";
export type TTimeCycle = {
  hours: string;
  min: string;
  Cycle: TMeridianCycle;
};
export type TkeyDbTime = "fromTime" | "toTime";
