import {
  dayKeyOfDateColumn,
  dayKeyToDateColumn,
  istDayKeySchema,
  istToday,
} from "@/lib/datetime";
import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { db } from "@/db";
import { getPackageByIdWithStatusAndCount } from "@/db/data/dto/package";
import { deriveScheduleInstants } from "@/lib/helpers/scheduleInstants";
import {
  getDateRangeArray,
  isDateValid,
  isProd,
  parseDateFormatYYYMMDDToNumber,
} from "@/lib/utils";
import {
  EnumScheduleTime,
  ScheduleCreateSchema,
  ScheduleSchema,
  UpdatedDateScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { isStatusCustom } from "@/lib/validators/Schedules";
import { AdminProcedure, router } from "@/server/trpc";
import { revalidateSchedules } from "@/revalidator/site";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  isPackageStatusCustom,
  isPackageStatusExclusive,
  ShouldStatusBeAvaiablePublicWithPackage,
} from "@/lib/validators/Package";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import {
  getAvailableSchedules,
  getBlockedScheduleDays,
  getScheduleCount,
  getSchedulesByDateRange,
  getSchedulesByDateRangeWithBookingCount,
} from "@/db/data/dto/schedule/schedule";
import { scheduleDateRangeValidator } from "@/lib/validators/scheduleDownloadValidator";
import { $Enums } from "@prisma/client";
import {
  DeleteBlockedDays,
  getAvailableScheduleCountForGivenDateArray,
  getBlockedScheduleCountForGivenDateArray,
} from "@/db/data/dto/schedule/block";

/**
 * Admin procedure that refreshes the public pages after a successful write.
 *
 * Schedule changes decide what the booking calendar and package pages show, and
 * this app has no time-based ISR anywhere — so before this, blocking a date in
 * the dashboard never reached visitors. Applied as middleware rather than
 * appended to each mutation body so the next mutation added cannot forget it.
 */
const ScheduleMutation = AdminProcedure.use(async (opts) => {
  const result = await opts.next();
  if (result.ok) {
    await revalidateSchedules();
  }
  return result;
});

export const schedule = router({
  getSchedulesByDateRange: AdminProcedure.input(
    scheduleDateRangeValidator,
  ).query(async ({ input: { fromDate, toDate, type } }) => {
    const fromDateParser = parseDateFormatYYYMMDDToNumber(fromDate);
    const toDateParser = parseDateFormatYYYMMDDToNumber(toDate);
    if (!fromDateParser || !toDateParser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Date Format is not valid YYYY-MM-DD",
      });
    }
    const validatedFromDate = isDateValid(fromDateParser);
    const validatedToDate = isDateValid(toDateParser);

    if (!validatedToDate || !validatedFromDate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested dates is invalid",
      });
    }
    const FromDate = new Date(fromDate);
    const ToDate = new Date(toDate);

    try {
      if (type === "scheduleWithoutBookingCount") {
        const data = await getSchedulesByDateRange(FromDate, ToDate);
        if (!data) return null;
        return data;
      }
      const data = await getSchedulesByDateRangeWithBookingCount(
        FromDate,
        ToDate,
      );
      if (!data) return null;
      return data;
    } catch (error) {
      console.log(error);
      ErrorLogger(error);
      return null;
    }
  }),
  getSchedulesByDateOrNow: AdminProcedure.input(ScheduleSchema).query(
    async ({ input: { ScheduleDate } }) => {
      // string that will receive is in the format YYYY-MM-DD
      //________________Validate Input Starts _____________
      const date = parseDateFormatYYYMMDDToNumber(ScheduleDate);
      if (!date) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Date Format is not valid YYYY-MM-DD",
        });
      }

      const validatedDate = isDateValid(date);

      if (!validatedDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Requested date is invalid",
        });
      }
      //________________Validate Input ends _____________
      try {
        const schedule = await db.schedule.findMany({
          where: {
            day: new Date(ScheduleDate),
          },
        });

        if (schedule.length < 0) {
          return null;
        }
        return schedule;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  ),
  getSchedulesInfinity: AdminProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    try {
      const { cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const data = await db.schedule.findMany({
        select: {
          day: true,
          startsAt: true,
          endsAt: true,
          id: true,
          packageId: true,
          schedulePackage: true,
          scheduleStatus: true,
          Package: {
            select: {
              title: true,
              startMinutesIst: true,
            },
          },
        },
        where: {
          // "Upcoming" against the IST day, not the server's instant. Comparing
          // a @db.Date column to `new Date(Date.now())` meant that between
          // 18:30 and 24:00 UTC the query had already rolled past today in
          // India and hid the current day's sailings for 5.5 hours a night.
          day: {
            gte: dayKeyToDateColumn(istToday()),
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        // Was `[{day}, {fromTime}]`, which sorted the time LEXICOGRAPHICALLY
        // over "09:00:AM" / "4:30:PM" strings — so 4:30 PM came before 9:00 AM.
        // `startsAt` is an instant, so this is a real chronological ordering,
        // and it is index-backed by @@index([scheduleStatus, startsAt]).
        orderBy: [
          {
            day: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.id;
      }
      // The in-memory re-sort that used to live here is gone. It re-parsed the
      // legacy time strings to fix the lexicographic ordering above, but ran
      // AFTER cursor pagination — so it only ever reordered within a page,
      // leaving the overall sequence wrong across page boundaries. Ordering
      // correctly in the query fixes it at the source.
      return {
        schedules: data,
        nextCursor,
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: "BAD_REQUEST", message: "Failed" });
    }
  }),
  // getupComingScheduleDates: AdminProcedure.input().query()
  createNewSchedule: ScheduleMutation.input(
    ScheduleCreateSchema.required({
      packageId: true,
    }),
  ).mutation(
    async ({
      ctx,
      input: {
        packageId,
        ScheduleDate,
        ScheduleTime,
        overrideStartMinutes,
        overrideEndMinutes,
      },
    }) => {
      /**
       * Check to do before creating a schedule.
       *  - There shouldn't be multiple schedule placed at the same Schedule time [multiple breakfast cruise].
       *  - Schedule should be new.
       *  - Schedule's can be Block be too, PackageId should be null and status should send a Blocked one.
       *  -
       */
      try {
        // `ScheduleDate` is an IstDayKey: istDayKeySchema already rejected
        // anything that is not a real YYYY-MM-DD, which is what the
        // parseDateFormatYYYMMDDToNumber + isDateValid prologue used to do by
        // hand. `dayKeyToDateColumn` is what a @db.Date wants — UTC midnight —
        // rather than `new Date(str)`, which only happens to agree.
        const day = dayKeyToDateColumn(ScheduleDate);

        const isPackageFound =
          await getPackageByIdWithStatusAndCount(packageId);

        if (!isPackageFound) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected Package is not found on our database.",
          });
        }

        // One numeric check, where there used to be two that tested different
        // variables: the CUSTOM gate read booleans from moment's strict
        // `hh:mm:A`, the category gate read the raw strings. Since that strict
        // parse rejected the unpadded "4:30:PM" the other parser accepted, an
        // afternoon time passed one gate and failed the other.
        const needsExplicitTime =
          isStatusCustom(ScheduleTime) ||
          isPackageStatusExclusive(isPackageFound.packageCategory) ||
          isPackageStatusCustom(isPackageFound.packageCategory);

        if (
          needsExplicitTime &&
          (overrideStartMinutes == null || overrideEndMinutes == null)
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Time is Required for ${isPackageFound.packageCategory.toLocaleLowerCase()} Packages.`,
          });
        }

        const Schedule = await db.schedule.findFirst({
          where: {
            AND: [
              {
                schedulePackage: ScheduleTime,
              },
              {
                day,
              },
            ],
          },
        });
        if (Schedule?.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Schedule has been already set for this date.",
          });
        }
        let scheduleStatus = ShouldStatusBeAvaiablePublicWithPackage({
          packageCategory: isPackageFound.packageCategory,
          scheduleTime: ScheduleTime,
        });

        // Resolve the sailing to absolute instants once, here, rather than
        // recombining (day + time string) at every read. Same helper the
        // webhook and the migration backfill use, so a schedule created from
        // the dashboard is indistinguishable from one created at payment time.
        const instants = deriveScheduleInstants({
          day: ScheduleDate,
          packageStartMinutesIst: isPackageFound.startMinutesIst,
          packageDurationMinutes: isPackageFound.duration,
          overrideStartMinutes,
          overrideEndMinutes,
        });

        const createdSchedule = await db.schedule.create({
          data: {
            day,
            packageId,
            startsAt: instants.startsAt,
            endsAt: instants.endsAt,
            isTimeOverridden: instants.isTimeOverridden,
            schedulePackage: ScheduleTime,
            scheduleStatus: scheduleStatus,
          },
        });

        return createdSchedule;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Something went wrong, Please try again. and report to developer.",
        });
      }
    },
  ),
  updateSchedule: ScheduleMutation.input(
    UpdatedDateScheduleSchema.extend({
      date: istDayKeySchema,
    }),
  ).mutation(
    async ({
      ctx,
      input: {
        date: ScheduleDate,
        packageId,
        scheduleTime,
        overrideStartMinutes,
        overrideEndMinutes,
      },
    }) => {
      try {
        const day = dayKeyToDateColumn(ScheduleDate);

        const isPackageFound =
          await getPackageByIdWithStatusAndCount(packageId);

        if (!isPackageFound) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected Package is not found on our database.",
          });
        }

        // Same single numeric gate as createNewSchedule — see the note there.
        const needsExplicitTime =
          isStatusCustom(scheduleTime) ||
          isPackageStatusExclusive(isPackageFound.packageCategory) ||
          isPackageStatusCustom(isPackageFound.packageCategory);

        if (
          needsExplicitTime &&
          (overrideStartMinutes == null || overrideEndMinutes == null)
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Time is Required for ${isPackageFound.packageCategory.toLocaleLowerCase()} Packages.`,
          });
        }
        const Schedule = await db.schedule.findFirst({
          where: {
            AND: [
              {
                schedulePackage: scheduleTime,
              },
              {
                day,
              },
            ],
          },
        });

        if (!Schedule?.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Sorry, Schedule not found.",
          });
        }
        let scheduleStatus = ShouldStatusBeAvaiablePublicWithPackage({
          packageCategory: isPackageFound.packageCategory,
          scheduleTime,
        });

        // Re-derive from the row's own day, not the input: an update may change
        // the package or the override times, and the instants must follow both.
        const instants = deriveScheduleInstants({
          day: Schedule.day,
          packageStartMinutesIst: isPackageFound.startMinutesIst,
          packageDurationMinutes: isPackageFound.duration,
          overrideStartMinutes,
          overrideEndMinutes,
        });

        const data = await db.schedule.update({
          where: {
            id: Schedule.id,
          },
          data: {
            packageId: isPackageFound.id,
            startsAt: instants.startsAt,
            endsAt: instants.endsAt,
            isTimeOverridden: instants.isTimeOverridden,
            scheduleStatus,
          },
        });

        return data;
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    },
  ),
  getBlockedSchedulesByDateRangeQuery: AdminProcedure.input(
    z.object({
      fromDate: z.string(),
      toDate: z.string(),
    }),
  ).query(async ({ input: { fromDate, toDate } }) => {
    const fromDateParser = parseDateFormatYYYMMDDToNumber(fromDate);
    const toDateParser = parseDateFormatYYYMMDDToNumber(toDate);

    if (!fromDateParser || !toDateParser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Date Format is not valid YYYY-MM-DD",
      });
    }

    const validatedFromDate = isDateValid(fromDateParser);
    const validatedToDate = isDateValid(toDateParser);

    if (!validatedToDate || !validatedFromDate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested dates is invalid",
      });
    }

    const FromDate = new Date(fromDate);
    const ToDate = new Date(toDate);

    try {
      // DATA FETCHING
      const [availableScheduleDetails, blockedSchedulesDetails] =
        await Promise.all([
          getAvailableSchedules({
            fromDate: FromDate,
            toDate: ToDate,
          }),
          await getBlockedScheduleDays({
            fromDate: FromDate,
            toDate: ToDate,
          }),
        ]);

      // DATE FORMATTING
      const blockedDayArr = blockedSchedulesDetails.map((item) =>
        dayKeyOfDateColumn(item.day),
      );

      const availableDayArr = availableScheduleDetails.map((item) =>
        dayKeyOfDateColumn(item.day),
      );

      return {
        blockedDates: blockedDayArr,
        availableDates: availableDayArr,
      };

      // DATE FILTRATION

      // const FilteredBlockedDates =
      //   filterDatesArrayToFormattedDateString(blockedDayArr);

      // const FilteredAvailableDates =
      //   filterDatesArrayToFormattedDateString(availableDayArr);

      // RETURNING FILTERED DATES
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something unexpected happened, Please try again.",
      });
    }
  }),
  unBlockScheduleByDateRange: ScheduleMutation.input(
    z.object({
      fromDate: z.string(),
      toDate: z.string(),
    }),
  ).mutation(async ({ input: { fromDate, toDate } }) => {
    const fromDateParser = parseDateFormatYYYMMDDToNumber(fromDate);
    const toDateParser = parseDateFormatYYYMMDDToNumber(toDate);

    if (!fromDateParser || !toDateParser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Date Format is not valid YYYY-MM-DD",
      });
    }

    const validatedFromDate = isDateValid(fromDateParser);
    const validatedToDate = isDateValid(toDateParser);

    if (!validatedToDate || !validatedFromDate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested dates is invalid",
      });
    }

    const FromDate = new Date(fromDate);
    const ToDate = new Date(toDate);

    const schedulePackage: $Enums.SCHEDULED_TIME[] = [
      "BREAKFAST",
      "LUNCH",
      "SUNSET",
      "DINNER",
      "CUSTOM",
    ];

    const dates = getDateRangeArray({ fromDate: FromDate, toDate: ToDate });

    // CHECK 1 - Making sure if all dates, does not contain existing schedule

    const availableCount =
      await getAvailableScheduleCountForGivenDateArray(dates);

    // If any date found with available schedule, return early

    if (availableCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested dates contains ongoing schedule package",
      });
    }

    // CHECK 2 - MAking sure if all packages of each date are currently blocked

    const expectedBlockedCount = dates.length * schedulePackage.length;

    const actualBlockedCount =
      await getBlockedScheduleCountForGivenDateArray(dates);

    // If fetched blocked dates and calculated blocked dates does not match return early

    if (expectedBlockedCount !== actualBlockedCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested date does not contain completely blocked schedules",
      });
    }

    // actual mutation query for unblocking

    try {
      const removed = DeleteBlockedDays(dates);
      return removed;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something unexpected happened, Please try again.",
      });
    }
  }),
  blockScheduleByDateRange: ScheduleMutation.input(
    z.object({
      fromDate: z.string(),
      toDate: z.string(),
    }),
  ).mutation(async ({ input: { fromDate, toDate } }) => {
    const fromDateParser = parseDateFormatYYYMMDDToNumber(fromDate);
    const toDateParser = parseDateFormatYYYMMDDToNumber(toDate);

    if (!fromDateParser || !toDateParser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Date Format is not valid YYYY-MM-DD",
      });
    }

    const validatedFromDate = isDateValid(fromDateParser);
    const validatedToDate = isDateValid(toDateParser);

    if (!validatedToDate || !validatedFromDate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested dates is invalid",
      });
    }
    // console.log("BEFORE new Date parse: ", { from: fromDate, to: toDate });

    const FromDate = new Date(fromDate);
    const ToDate = new Date(toDate);

    // console.log("AFTER new Date parse: ", { from: FromDate, to: ToDate });

    // check if any schedules are active in the received date range - if yes return, else continue
    const scheduleCount = await getScheduleCount({ FromDate, ToDate });

    if (scheduleCount > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Schedule cannot be blocked because the date range you've selected overlaps with an existing schedule",
      });
    }

    // creating date array using received dates
    const dates = getDateRangeArray({ fromDate: FromDate, toDate: ToDate });

    // console.log("FINAL from and to date from server: ", {
    //   "from": dates[0],
    //   "to": dates[dates.length - 1],
    // });

    const blockScheduleData: {
      id?: string;
      day: Date;
      schedulePackage: $Enums.SCHEDULED_TIME;
      scheduleStatus: $Enums.SCHEDULE_STATUS;
    }[] = [];

    const schedulePackage: $Enums.SCHEDULED_TIME[] = [
      "BREAKFAST",
      "LUNCH",
      "SUNSET",
      "DINNER",
      "CUSTOM",
    ];

    // creating date for bulk update
    dates.forEach((date) =>
      schedulePackage.forEach((scheduleTime) => {
        blockScheduleData.push({
          day: new Date(date),
          schedulePackage: scheduleTime,
          scheduleStatus: "BLOCKED",
        });
      }),
    );

    // block schedule for the given date range
    try {
      const result = await db.$transaction((tx) =>
        tx.schedule.createMany({
          data: blockScheduleData,
          skipDuplicates: true,
        }),
      );
      return result;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something unexpected happened, Please try again.",
      });
    }
  }),
  blockScheduleByDateAndStatus: ScheduleMutation.input(
    z.object({
      date: z.string(),
      ScheduleTime: EnumScheduleTime,
    }),
  ).mutation(async ({ ctx, input: { ScheduleTime, date: ScheduleDate } }) => {
    try {
      const date = parseDateFormatYYYMMDDToNumber(ScheduleDate);
      if (!date) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Date Format is not valid YYYY-MM-DD",
        });
      }

      const validatedDate = isDateValid(date);

      if (!validatedDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Requested date is invalid",
        });
      }

      let SafelyParsedDate = new Date(ScheduleDate);

      const Schedule = await db.schedule.findFirst({
        where: {
          AND: [
            {
              schedulePackage: ScheduleTime,
            },
            {
              day: SafelyParsedDate,
            },
          ],
        },
      });
      if (Schedule?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot block a schedule that already set.",
        });
      }
      const blockedSchedule = await db.schedule.create({
        data: {
          day: SafelyParsedDate,
          schedulePackage: ScheduleTime,
          scheduleStatus: "BLOCKED",
        },
      });
      return blockedSchedule;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something unexpected happened, Please try again.",
      });
    }
  }),
  unBlockScheduleById: ScheduleMutation.input(
    z.object({
      scheduleId: z.string(),
    }),
  ).mutation(async ({ ctx, input: { scheduleId } }) => {
    try {
      const data = await db.schedule.findUnique({
        where: {
          id: scheduleId,
          scheduleStatus: "BLOCKED",
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Schedule not found.",
        });
      }
      const deletedData = await db.schedule.delete({
        where: {
          id: scheduleId,
          scheduleStatus: "BLOCKED",
        },
      });
      return deletedData;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong on server",
      });
    }
  }),
  deleteScheduleById: ScheduleMutation.input(
    z.object({
      scheduleId: z.string(),
    }),
  ).mutation(async ({ ctx, input: { scheduleId } }) => {
    try {
      const isScheduleExists = await db.schedule.count({
        where: {
          id: scheduleId,
        },
      });
      if (!isScheduleExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "schedule not found.",
        });
      }
      const isScheduleBookingFound = await db.booking.findFirst({
        where: {
          scheduleId,
        },
        select: {
          id: true,
        },
      });
      if (isScheduleBookingFound?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Schedule Cannot be deleted because of existing booking found.",
        });
      }
      const data = await db.schedule.delete({
        where: {
          id: scheduleId,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  clearSchedule: ScheduleMutation.mutation(async () => {
    try {
      if (isProd) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You are on production cannot cascade all the schedules.",
        });
      }

      await db.booking.deleteMany();
      await db.schedule.deleteMany();
      // const clearSchedule = await db.schedule.deleteMany({});
      return true;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOmehting went wrong",
      });
    }
  }),
});
