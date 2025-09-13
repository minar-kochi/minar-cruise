import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { defaultEmptyTrigger } from "@/constants/data/timer";
import { db } from "@/db";
import { getPackageByIdWithStatusAndCount } from "@/db/data/dto/package";
import {
  combineDateWithSplitedTime,
  getDateRangeArray,
  isDateValid,
  isProd,
  isValidMergeTimeCycle,
  mergeTimeCycle,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
  splitTimeColon,
} from "@/lib/utils";
import {
  EnumScheduleTime,
  ScheduleCreateSchema,
  ScheduleSchema,
  UpdatedDateScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { isStatusCustom } from "@/lib/validators/Schedules";
import { AdminProcedure, router } from "@/server/trpc";
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
import { isSameDay, toDate } from "date-fns";
import { scheduleDateRangeValidator } from "@/lib/validators/scheduleDownloadValidator";
import { $Enums } from "@prisma/client";
import {
  DeleteBlockedDays,
  getAvailableScheduleCountForGivenDateArray,
  getBlockedScheduleCountForGivenDateArray,
} from "@/db/data/dto/schedule/block";

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
          fromTime: true,
          id: true,
          packageId: true,
          schedulePackage: true,
          scheduleStatus: true,
          toTime: true,
          Package: {
            select: {
              title: true,
              fromTime: true,
              toTime: true,
            },
          },
        },
        where: {
          day: {
            gte: new Date(Date.now()),
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        orderBy: [
          {
            day: "asc",
          },
          {
            fromTime: "asc",
          },
        ],
        // distinct: ["day", "fromTime"]
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        nextCursor = nextItem?.id;
      }
      try {
        data.sort((a, b) => {
          let Atime = splitTimeColon(a.fromTime ?? a.Package?.fromTime ?? "");
          let Btime = splitTimeColon(b.fromTime ?? b.Package?.fromTime ?? "");

          if (!Btime || !Atime) return 0;

          let ADate = combineDateWithSplitedTime(a.day, Atime);
          let BDate = combineDateWithSplitedTime(b.day, Btime);
          return ADate.getTime() - BDate.getTime();
        });
      } catch (error) {
        console.log(error);
      }
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
  createNewSchedule: AdminProcedure.input(
    ScheduleCreateSchema.required({
      packageId: true,
    }),
  ).mutation(
    async ({
      ctx,
      input: { packageId, ScheduleDate, ScheduleTime, ScheduleDateTime },
    }) => {
      /**
       * Check to do before creating a schedule.
       *  - There shouldn't be multiple schedule placed at the same Schedule time [multiple breakfast cruise].
       *  - Schedule should be new.
       *  - Schedule's can be Block be too, PackageId should be null and status should send a Blocked one.
       *  -
       */

      //________________Validate Input Starts _____________
      /** */
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

        const isPackageFound =
          await getPackageByIdWithStatusAndCount(packageId);

        if (!isPackageFound) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected Package is not found on our database.",
          });
        }

        //________________Validate Input ends _____________
        // Test out the date that is received (UTC format.)
        let SafelyParsedDate = new Date(ScheduleDate);

        let fromTimeObj =
          mergeTimeCycle(ScheduleDateTime?.fromTime ?? defaultEmptyTrigger) ??
          null;

        let toTimeObjParsed =
          mergeTimeCycle(ScheduleDateTime?.toTime ?? defaultEmptyTrigger) ??
          null;

        let toTime = isValidMergeTimeCycle(toTimeObjParsed ?? "");
        let fromTime = isValidMergeTimeCycle(fromTimeObj ?? "");

        if (isStatusCustom(ScheduleTime) && (!toTime || !fromTime)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Time is Required for ${ScheduleTime} Packages.`,
          });
        }

        if (
          (isPackageStatusExclusive(isPackageFound.packageCategory) ||
            isPackageStatusCustom(isPackageFound.packageCategory)) &&
          (!toTime || !fromTime)
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
                day: SafelyParsedDate,
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

        const createdSchedule = await db.schedule.create({
          data: {
            day: SafelyParsedDate,
            packageId,
            fromTime: fromTime ? fromTimeObj : null,
            toTime: toTime ? toTimeObjParsed : null,
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
  updateSchedule: AdminProcedure.input(
    UpdatedDateScheduleSchema.extend({
      date: z.string(),
    }),
  ).mutation(
    async ({
      ctx,
      input: { date: ScheduleDate, packageId, scheduleTime, ...input },
    }) => {
      try {
        let { fromTime, toTime } = input;

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

        let fromTimeObj =
          mergeTimeCycle(fromTime ?? defaultEmptyTrigger) ?? null;

        let toTimeObjParsed =
          mergeTimeCycle(toTime ?? defaultEmptyTrigger) ?? null;

        let toTimeParsed = isValidMergeTimeCycle(toTimeObjParsed ?? "");
        let fromTimeParsed = isValidMergeTimeCycle(fromTimeObj ?? "");

        if (isStatusCustom(scheduleTime) && (!toTime || !fromTime)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Time is Required for ${scheduleTime} Packages.`,
          });
        }

        const isPackageFound =
          await getPackageByIdWithStatusAndCount(packageId);

        if (!isPackageFound) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected Package is not found on our database.",
          });
        }
        if (
          (isPackageStatusExclusive(isPackageFound.packageCategory) ||
            isPackageStatusCustom(isPackageFound.packageCategory)) &&
          (!toTime || !fromTime)
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
                day: SafelyParsedDate,
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

        const data = await db.schedule.update({
          where: {
            id: Schedule.id,
          },
          data: {
            packageId: isPackageFound.id,
            fromTime: fromTimeParsed ? fromTimeObj : null,
            toTime: toTimeParsed ? toTimeObjParsed : null,
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
        RemoveTimeStampFromDate(item.day),
      );

      const availableDayArr = availableScheduleDetails.map((item) =>
        RemoveTimeStampFromDate(item.day),
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
  unBlockScheduleByDateRange: AdminProcedure.input(
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
  blockScheduleByDateRange: AdminProcedure.input(
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
  blockScheduleByDateAndStatus: AdminProcedure.input(
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
  unBlockScheduleById: AdminProcedure.input(
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
  deleteScheduleById: AdminProcedure.input(
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
  clearSchedule: AdminProcedure.mutation(async () => {
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
