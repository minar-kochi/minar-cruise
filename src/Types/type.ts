import { TKeyOrganized } from "@/components/admin/dashboard/Schedule/ScheduleSelector";
import { Schedule } from "@prisma/client";

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

export type TScheduleDataDayReplaceString = Omit<
  Schedule,
  "day" | "createdAt" | "updatedAt"
> & {
  day: string;
  createdAt: String;
  updatedAt: string;
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
