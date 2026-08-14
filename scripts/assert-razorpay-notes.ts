/**
 * Razorpay caps order `notes` at 15 key/value pairs, and the booking-link id has
 * to survive handle-order.ts's `schedule.create -> schedule.existing` rewrite.
 * Both are easy to break silently, so assert them.
 *
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx scripts/assert-razorpay-notes.ts
 */
import { getNotes } from "../src/lib/razorpay/getNotes";
import type {
  TRazorPayEventsCreateSchedule,
  TRazorPayEventsExistingSchedule,
} from "../src/Types/razorpay/type";

const RAZORPAY_MAX_NOTES = 15;

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? ` — ${detail}` : ""}`);
}

const booking = {
  bookingId: "bk_1",
  userId: "u_1",
  name: "Test Customer",
  email: "test@example.com",
  adultCount: 2,
  childCount: 1,
  babyCount: 0,
};

// ---------------------------------------------------------------------------
console.log("\nPublic flow (no booking link) must be unchanged");

const publicExisting = getNotes({
  eventType: "schedule.existing",
  packageId: "pk_1",
  scheduleId: "sc_1",
  packageTitle: "Sunset Dinner Cruise",
  scheduledDate: "22-05-2026",
  ...booking,
});
check(
  "schedule.existing has no bookingLinkId key",
  !("bookingLinkId" in publicExisting),
  Object.keys(publicExisting).length + " keys",
);
check(
  `schedule.existing within the ${RAZORPAY_MAX_NOTES}-key cap`,
  Object.keys(publicExisting).length <= RAZORPAY_MAX_NOTES,
  `${Object.keys(publicExisting).length} keys`,
);

const publicCreate = getNotes({
  eventType: "schedule.create",
  packageId: "pk_1",
  date: "2026-05-22",
  ScheduleTime: "DINNER",
  packageTitle: "Sunset Dinner Cruise",
  ...booking,
});
check(
  "schedule.create has no bookingLinkId key",
  !("bookingLinkId" in publicCreate),
  Object.keys(publicCreate).length + " keys",
);

// ---------------------------------------------------------------------------
console.log("\nBooking-link flow carries the id and stays within the cap");

const linkExisting = getNotes({
  eventType: "schedule.existing",
  packageId: "pk_1",
  scheduleId: "sc_1",
  packageTitle: "Sunset Dinner Cruise",
  scheduledDate: "22-05-2026",
  bookingLinkId: "bl_1",
  ...booking,
}) as TRazorPayEventsExistingSchedule;

check("schedule.existing carries bookingLinkId", linkExisting.bookingLinkId === "bl_1");
check(
  `schedule.existing within the ${RAZORPAY_MAX_NOTES}-key cap`,
  Object.keys(linkExisting).length <= RAZORPAY_MAX_NOTES,
  `${Object.keys(linkExisting).length} keys`,
);

const linkCreate = getNotes({
  eventType: "schedule.create",
  packageId: "pk_1",
  date: "2026-05-22",
  ScheduleTime: "DINNER",
  packageTitle: "Sunset Dinner Cruise",
  bookingLinkId: "bl_1",
  ...booking,
}) as TRazorPayEventsCreateSchedule;

check("schedule.create carries bookingLinkId", linkCreate.bookingLinkId === "bl_1");
check(
  `schedule.create within the ${RAZORPAY_MAX_NOTES}-key cap`,
  Object.keys(linkCreate).length <= RAZORPAY_MAX_NOTES,
  `${Object.keys(linkCreate).length} keys`,
);

// ---------------------------------------------------------------------------
// The high-risk path: a link was issued for a date with no schedule, someone
// created that schedule before the customer paid, and handle-order.ts rewrites
// the notes. This replicates that transform exactly.
console.log("\nhandle-order.ts schedule.create -> schedule.existing rewrite");

const { ScheduleTime, packageId, date, eventType, ...rest } = linkCreate;
const rewritten = getNotes({
  eventType: "schedule.existing",
  scheduleId: "sc_created_later",
  packageId,
  scheduledDate: date,
  ...rest,
}) as TRazorPayEventsExistingSchedule;

check(
  "bookingLinkId survives the ...rest re-spread",
  rewritten.bookingLinkId === "bl_1",
  `got ${JSON.stringify(rewritten.bookingLinkId)}`,
);
check("rewritten notes keep the booking id", rewritten.bookingId === "bk_1");
check("rewritten notes keep the guest counts", rewritten.adultCount === 2);
check(
  `rewritten notes within the ${RAZORPAY_MAX_NOTES}-key cap`,
  Object.keys(rewritten).length <= RAZORPAY_MAX_NOTES,
  `${Object.keys(rewritten).length} keys`,
);

// ---------------------------------------------------------------------------
// Razorpay drops/rejects undefined values; make sure we never emit one.
console.log("\nNo undefined values in any shape");
for (const [label, notes] of [
  ["public existing", publicExisting],
  ["public create", publicCreate],
  ["link existing", linkExisting],
  ["link create", linkCreate],
  ["rewritten", rewritten],
] as const) {
  const undef = Object.entries(notes)
    .filter(([, v]) => v === undefined)
    .map(([k]) => k);
  check(`${label} has no undefined values`, undef.length === 0, undef.join(","));
}

console.log(
  failures === 0
    ? "\nAll Razorpay notes assertions passed.\n"
    : `\n${failures} assertion(s) FAILED.\n`,
);
process.exit(failures === 0 ? 0 : 1);
