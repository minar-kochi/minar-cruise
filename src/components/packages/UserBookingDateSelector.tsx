// "use client";
// import { useState } from "react";
// import { Button } from "../ui/button";
// import { Calendar } from "../ui/calendar";
// import { trpc } from "@/app/_trpc/client";
// import {
//   cn,
//   filterDateFromCalender,
//   RemoveTimeStampFromDate,
// } from "@/lib/utils";
// import ClientCalenderScheduleDay from "../calender/ClientCalenderScheduleDay";
// import { $Enums } from "@prisma/client";
// import BookingFormCard from "./BookingFormCard";
// interface IUserBookingDateSelector {
//   packageTitle: string;
//   packageId: string;
//   packagePrice: {
//     child: number;
//     adult: number;
//   };
//   packageCategory: $Enums.PACKAGE_CATEGORY;
//   className?: string;
// }
// export default function UserBookingDateSelector({
//   packageTitle,
//   packageId,
//   packagePrice,
//   packageCategory,
//   className,
// }: IUserBookingDateSelector) {
//   const [date, setDate] = useState<Date>(new Date(Date.now()));
//   const [month, setMonth] = useState<string>(
//     RemoveTimeStampFromDate(new Date(Date.now())),
//   );
//   const [isNextSlide, setIsNextSlide] = useState(false);
//   const [selectedScheduleId, setSelectedScheduleId] = useState<{
//     scheduleId: string;
//     scheduleStatus: $Enums.SCHEDULE_STATUS;
//   } | null>(null);

//   const { refetch, isFetching, data } =
//     trpc.user.getSchedulesByPackageIdAndDate.useQuery({
//       packageId: packageId,
//       date: month,
//     });

//   const availableDateArray = data?.schedules.map((item) => {
//     return item.day;
//   });

//   const disabledDays = data?.blockedScheduleDateArray.map((item) => ({
//     day: new Date(item.day),
//   }));

//   return (
//     <div
//       className={cn(
//         "flex flex-col items-center justify-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-4 gap-4 rounded-2xl",
//         className,
//       )}
//     >
//       {!isNextSlide ? (
//         <>
//           <h1 className="text-2xl font-bold text-center">
//             Check Available Dates
//           </h1>
//           <Calendar
//             sizeMode="lg"
//             disabled={(date) =>
//               filterDateFromCalender({ date, dateArray: disabledDays })
//             }
//             mode="single"
//             components={{
//               DayContent: (props) =>
//                 ClientCalenderScheduleDay({
//                   AvailableDate: availableDateArray,
//                   props,
//                 }),
//             }}
//             selected={date}
//             onSelect={(date) => {
//               if (!date) return;
//               setDate(date);
//               if (!data || !data.schedules) return;
//               let scheduleIndex = data?.schedules.findIndex(
//                 (fv) =>
//                   RemoveTimeStampFromDate(new Date(fv.day)) ===
//                   RemoveTimeStampFromDate(date),
//               );
//               let schedule =
//                 scheduleIndex !== -1 ? data.schedules[scheduleIndex] : null;
//               if (!schedule) {
//                 setSelectedScheduleId(null);
//                 return;
//               }
//               setSelectedScheduleId({
//                 scheduleId: schedule.id,
//                 scheduleStatus: schedule.scheduleStatus,
//               });
//             }}
//             onMonthChange={(month) => {
//               setMonth(RemoveTimeStampFromDate(month));
//             }}
//           />
//         </>
//       ) : (
//         <BookingFormCard
//           isNextSlideState={setIsNextSlide}
//           selectedDate={date}
//           selectedSchedule={{
//             scheduleId: selectedScheduleId?.scheduleId,
//             scheduleStatus: selectedScheduleId?.scheduleStatus,
//           }}
//           packageId={packageId}
//           packagePrice={packagePrice}
//           packageCategory={packageCategory}
//         />
//       )}
//       <Button
//         onClick={() => setIsNextSlide((prev) => !prev)}
//         className={cn("w-full", {
//           hidden: isNextSlide,
//         })}
//       >
//         Next
//       </Button>
//       <Button
//         onClick={() => setIsNextSlide((prev) => !prev)}
//         className={cn("w-full", {
//           hidden: !isNextSlide,
//         })}
//       >
//         Back
//       </Button>
//     </div>
//   );
// }
