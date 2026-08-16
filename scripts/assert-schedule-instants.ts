/**
 * Assertions for deriveScheduleInstants — the write-time rule that every
 * Schedule writer shares (admin create/update, the order.paid webhook, and the
 * migration backfill).
 *
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx scripts/assert-schedule-instants.ts
 *
 * Like scripts/assert-datetime.ts, every assertion must hold identically under
 * any host TZ — run it under several and diff.
 *
 * The cases below are drawn from real production rows, including the two that
 * made the naive version of this migration wrong: an overnight sailing whose
 * return is on the following IST day, and a typo whose return precedes its
 * departure by eight hours.
 */
import { formatIstRange, istDayKeyOf, type IstDayKey } from "../src/lib/datetime";
import { deriveScheduleInstants } from "../src/lib/helpers/scheduleInstants";

let failures = 0;
const key = (s: string) => s as IstDayKey;

function check(label: string, actual: unknown, expected: unknown) {
  const a = actual instanceof Date ? actual.toISOString() : actual;
  const e = expected instanceof Date ? expected.toISOString() : expected;
  const ok = a === e;
  if (!ok) failures++;
  console.log(
    `${ok ? "  ok  " : " FAIL "} ${label}${ok ? "" : ` — expected ${e}, got ${a}`}`,
  );
}

console.log(`\nTZ=${process.env.TZ ?? "(unset)"}`);

// ---------------------------------------------------------------------------
console.log("\nAVAILABLE — inherits the package's departure (495 prod rows)");
const inherited = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: 540, // 09:00 breakfast
  packageDurationMinutes: 120,
});
check("startsAt = 09:00 IST", inherited.startsAt, new Date("2026-08-16T03:30:00.000Z"));
check("endsAt = 11:00 IST", inherited.endsAt, new Date("2026-08-16T05:30:00.000Z"));
check("not flagged as overridden", inherited.isTimeOverridden, false);
check("no review needed", inherited.needsTimeReview, false);

// ---------------------------------------------------------------------------
console.log("\nEXCLUSIVE — explicit override wins over the package (23 prod rows)");
const override = deriveScheduleInstants({
  day: key("2025-11-11"),
  packageStartMinutesIst: 1020, // package says 17:00
  packageDurationMinutes: 240,
  overrideFrom: "01:00:PM", // admin says 13:00
  overrideTo: "03:00:PM",
});
check("startsAt follows the override", override.startsAt, new Date("2025-11-11T07:30:00.000Z"));
check("endsAt follows the override", override.endsAt, new Date("2025-11-11T09:30:00.000Z"));
check("marked as overridden", override.isTimeOverridden, true);

// An unpadded override — the form moment's strict hh:mm:A used to reject,
// which rendered the slot as a bare " - ".
const unpadded = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: 540,
  packageDurationMinutes: 120,
  overrideFrom: "4:30:PM",
  overrideTo: "6:30:PM",
});
check("unpadded override parses", unpadded.startsAt, new Date("2026-08-16T11:00:00.000Z"));
check("unpadded override is not flagged", unpadded.needsTimeReview, false);

// ---------------------------------------------------------------------------
console.log("\nBLOCKED — no package, no override, no sailing (229 prod rows)");
const blocked = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: null,
  packageDurationMinutes: null,
});
check("startsAt stays NULL", blocked.startsAt, null);
check("endsAt stays NULL", blocked.endsAt, null);
check("not flagged for review — this is correct, not broken", blocked.needsTimeReview, false);
check("not overridden", blocked.isTimeOverridden, false);

// ---------------------------------------------------------------------------
console.log("\nMidnight crossing — production row 2025-11-23 22:00 -> 00:00");
const crossing = deriveScheduleInstants({
  day: key("2025-11-23"),
  packageStartMinutesIst: 1020,
  packageDurationMinutes: 240,
  overrideFrom: "10:00:PM",
  overrideTo: "12:00:AM",
});
check("departs on the 23rd", istDayKeyOf(crossing.startsAt!), "2025-11-23");
check("returns on the 24th", istDayKeyOf(crossing.endsAt!), "2025-11-24");
check("endsAt is after startsAt", crossing.endsAt! > crossing.startsAt!, true);
check("not flagged — this is a real sailing", crossing.needsTimeReview, false);
check(
  "renders with the (+1) marker",
  formatIstRange(crossing.startsAt, crossing.endsAt),
  "10:00 PM – 12:00 AM (+1)",
);

// ---------------------------------------------------------------------------
console.log("\nImplausible — production row 2025-11-13 23:00 -> 15:00 (a typo)");
// Rolling this to the next day would invent a 16-hour cruise. Refuse instead.
const implausible = deriveScheduleInstants({
  day: key("2025-11-13"),
  packageStartMinutesIst: 1020,
  packageDurationMinutes: 240,
  overrideFrom: "11:00:PM",
  overrideTo: "03:00:PM",
});
check("startsAt is still resolved", implausible.startsAt, new Date("2025-11-13T17:30:00.000Z"));
check("endsAt is refused, not guessed", implausible.endsAt, null);
check("flagged for a human", implausible.needsTimeReview, true);

// The boundary: exactly 6h is allowed, 6h1m is not.
const atCeiling = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: 0,
  packageDurationMinutes: 0,
  overrideFrom: "10:00:PM", // 1320
  overrideTo: "04:00:AM", // 240 -> +1440 = 1680, span exactly 360
});
check("exactly 6h crosses midnight", atCeiling.needsTimeReview, false);
check("6h endsAt is next day", istDayKeyOf(atCeiling.endsAt!), "2026-08-17");

const overCeiling = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: 0,
  packageDurationMinutes: 0,
  overrideFrom: "10:00:PM", // 1320
  overrideTo: "04:01:AM", // span 361 > ceiling
});
check("6h01m is refused", overCeiling.endsAt, null);
check("6h01m is flagged", overCeiling.needsTimeReview, true);

// ---------------------------------------------------------------------------
console.log("\nPartial / malformed input");
const halfOverride = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: 540,
  packageDurationMinutes: 120,
  overrideFrom: "10:00:AM",
  overrideTo: null, // only a start was set
});
check("half override starts at the override", halfOverride.startsAt, new Date("2026-08-16T04:30:00.000Z"));
check("half override ends via package duration", halfOverride.endsAt, new Date("2026-08-16T06:30:00.000Z"));
check("half override is NOT 'overridden'", halfOverride.isTimeOverridden, false);

const garbage = deriveScheduleInstants({
  day: key("2026-08-16"),
  packageStartMinutesIst: 540,
  packageDurationMinutes: 120,
  overrideFrom: "not a time",
  overrideTo: "also not",
});
check("unparseable override falls back to the package", garbage.startsAt, new Date("2026-08-16T03:30:00.000Z"));

const badDay = deriveScheduleInstants({
  day: "2026-02-30",
  packageStartMinutesIst: 540,
  packageDurationMinutes: 120,
});
check("an impossible day yields no instants", badDay.startsAt, null);

// ---------------------------------------------------------------------------
console.log("\nThe day-match invariant the CHECK constraint enforces");
// (startsAt AT TIME ZONE 'Asia/Kolkata')::date must equal `day`, for every
// hour of the day — including the ones that fall on a different UTC date.
for (const minutes of [0, 1, 330, 540, 1050, 1439]) {
  const r = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: minutes,
    packageDurationMinutes: 60,
  });
  check(
    `startsAt at ${String(minutes).padStart(4)}min is still 2026-08-16 in IST`,
    istDayKeyOf(r.startsAt!),
    "2026-08-16",
  );
}

console.log(
  failures === 0
    ? "\nAll schedule-instant assertions passed.\n"
    : `\n${failures} assertion(s) FAILED.\n`,
);
process.exit(failures === 0 ? 0 : 1);
