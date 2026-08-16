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

/**
 * What a Schedule actually looks like once it has crossed the tRPC boundary.
 *
 * This type exists only because the superjson transformer is commented out in
 * src/server/trpc.ts — without it every `Date` is serialised to an ISO string
 * while the inferred type still claims `Date`. This is the hand-maintained
 * correction for that lie, and every new Date column has to be added here or
 * the types silently drift from reality again.
 *
 * DELETE THIS TYPE when superjson is enabled; the inferred types become correct
 * on their own and `startsAt`/`endsAt` arrive as real Date objects.
 */
export type TScheduleDataDayReplaceString = Omit<
  Schedule,
  "day" | "createdAt" | "updatedAt" | "startsAt" | "endsAt"
> & {
  day: string;
  createdAt: String;
  updatedAt: string;
  startsAt: string | null;
  endsAt: string | null;
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
