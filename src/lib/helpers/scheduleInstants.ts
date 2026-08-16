/**
 * The one rule for turning a schedule's day + times into absolute instants.
 *
 * Every writer of a Schedule row goes through here — the two admin procedures,
 * the payment webhook, and the migration backfill — so a schedule created at
 * 3am by a webhook and one created by an admin in the dashboard cannot end up
 * with instants derived by different rules.
 *
 * The inherit-or-override question used to be answered at every *read*
 * (`schedule.fromTime ?? package.fromTime ?? ""`), in ~130 places, which is why
 * a package with an unparseable time rendered as a bare " - " in some views and
 * correctly in others. It is now answered exactly once, here, at write time.
 */
import {
  dayKeyOfDateColumn,
  istInstant,
  parseIstDayKey,
  parseLegacyMeridiemTime,
  type IstDayKey,
} from "@/lib/datetime";

/**
 * The longest sailing we will believe when a return time appears to precede its
 * departure. Longest legitimate cruise is 4h (max Package.duration = 240);
 * longest override observed in production is 5h.
 *
 * Under the ceiling, "22:00 -> 00:00" is a real midnight crossing and the end
 * rolls to the next IST day. Over it, the input is a typo — production held one
 * such row, "11:00:PM -> 03:00:PM", which would otherwise have become a
 * 16-hour cruise. We refuse to guess rather than invent a sailing.
 */
export const MAX_CRUISE_MINUTES = 360;

export type ScheduleInstants = {
  startsAt: Date | null;
  endsAt: Date | null;
  isTimeOverridden: boolean;
  /** Set when a return time could not be resolved and a human must look. */
  needsTimeReview: boolean;
};

/** A schedule with no departure at all — a BLOCKED slot marker. */
export const TIMELESS: ScheduleInstants = {
  startsAt: null,
  endsAt: null,
  isTimeOverridden: false,
  needsTimeReview: false,
};

function toDayKey(day: Date | IstDayKey | string): IstDayKey | null {
  if (day instanceof Date) return dayKeyOfDateColumn(day);
  return parseIstDayKey(day);
}

/**
 * Resolves the instants for one schedule.
 *
 * `overrideFrom`/`overrideTo` are the legacy `"4:30:PM"` strings, which remain
 * the wire format for the admin time widget until it is replaced. Pass null to
 * inherit the package's departure — the normal case for AVAILABLE schedules.
 *
 * Returns TIMELESS when there is neither an override nor a package to inherit
 * from, which is what a BLOCKED row looks like.
 */
export function deriveScheduleInstants(args: {
  day: Date | IstDayKey | string;
  /** `Package.startMinutesIst`; null when the schedule has no package. */
  packageStartMinutesIst?: number | null;
  /** `Package.duration` in minutes; null when the schedule has no package. */
  packageDurationMinutes?: number | null;
  /** Legacy `Schedule.fromTime` override, e.g. "4:30:PM". */
  overrideFrom?: string | null;
  /** Legacy `Schedule.toTime` override. */
  overrideTo?: string | null;
}): ScheduleInstants {
  const dayKey = toDayKey(args.day);
  if (!dayKey) return TIMELESS;

  const overrideStart = parseLegacyMeridiemTime(args.overrideFrom);
  const startMin = overrideStart ?? args.packageStartMinutesIst ?? null;

  // No override and no package: a BLOCKED marker. It has no sailing.
  if (startMin === null) return TIMELESS;

  const overrideEnd = parseLegacyMeridiemTime(args.overrideTo);
  const rawEnd =
    overrideEnd ??
    (args.packageDurationMinutes != null
      ? startMin + args.packageDurationMinutes
      : null);

  const isTimeOverridden = overrideStart !== null && overrideEnd !== null;

  if (rawEnd === null) {
    return {
      startsAt: istInstant(dayKey, startMin),
      endsAt: null,
      isTimeOverridden,
      needsTimeReview: true,
    };
  }

  let endMin: number | null;
  if (rawEnd > startMin) {
    endMin = rawEnd;
  } else if (rawEnd + 1440 - startMin <= MAX_CRUISE_MINUTES) {
    endMin = rawEnd + 1440; // crosses midnight into the next IST day
  } else {
    endMin = null; // implausible — refuse to guess
  }

  return {
    startsAt: istInstant(dayKey, startMin),
    endsAt: endMin === null ? null : istInstant(dayKey, endMin),
    isTimeOverridden,
    needsTimeReview: endMin === null,
  };
}
