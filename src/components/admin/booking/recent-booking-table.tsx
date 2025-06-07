// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { EllipsisVertical, Eye, Edit, Trash2, Mail } from "lucide-react";
// import { TGetRecentBookingInfo } from "@/db/data/dto/schedule";
// import { InfiniteData } from "@tanstack/react-query";

// // Type definition based on your Prisma query
// type RecentBooking = {
//   id: string;
//   createdAt: Date;
//   numOfAdults: number;
//   numOfBaby: number;
//   numOfChildren: number;
//   totalBooking: number;
//   scheduleId: string;
//   user: {
//     contact: string;
//     email: string;
//     id: string;
//     name: string;
//   };
//   payment: {
//     totalAmount: number;
//     advancePaid: number;
//     modeOfPayment: string;
//   };
//   schedule: {
//     id: string;
//     fromTime: string | null;
//     toTime: string | null;
//     packageId: string;
//     day: string;
//     Package: {
//       title: string;
//       fromTime: string;
//       toTime: string;
//     } | null;
//   };
// };

// // Utility function to select time from schedule or package
// const selectFromTimeAndToTimeFromScheduleOrPackages = ({
//   Packages,
//   schedule,
// }: {
//   Packages: {
//     packageFromTime: string;
//     packageToTime: string;
//   };
//   schedule: {
//     scheduleFromTime: string | null;
//     scheduleToTime: string | null;
//   };
// }) => {
//   return {
//     fromTime: schedule.scheduleFromTime || Packages.packageFromTime,
//     toTime: schedule.scheduleToTime || Packages.packageToTime,
//   };
// };
// type DateToString<T> = {
//   [K in keyof T]: T[K] extends Date
//     ? string | null
//     : T[K] extends object
//       ? DateToString<T[K]>
//       : T[K];
// };

// type Td = TGetRecentBookingInfo[number];

// type TRemovedDate = DateToString<Td>;
// interface RecentBookingsTableProps {
//   bookings: InfiniteData<{ response: TRemovedDate[] }> | null;

//   resendEmail?: (bookingId: string) => void;
//   viewBooking?: (scheduleId: string) => void;
//   onDeleteBooking?: (bookingId: string) => void;
//   isLoading?: boolean;
// }

// export default function RecentBookingsTable({
//   bookings,
//   resendEmail,
//   viewBooking,
//   onDeleteBooking,
//   isLoading = false,
// }: RecentBookingsTableProps) {
//   if (isLoading) {
//     return (
//       <div className="w-full">
//         <div className="animate-pulse">
//           <div className="h-12 bg-gray-200 rounded mb-4"></div>
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-auto border-2">
//       <Table className="min-w-full">
//         <TableHeader className="bg-muted-foreground/10">
//           <TableRow className="text-md">
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:p-2">
//               #
//             </TableHead>
//             <TableHead className="h-16 max-sm:text-[9px] font-bold max-sm:text-pretty min-w-[100px]">
//               Customer
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:p-2">
//               Booking Date
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
//               Day
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:p-2">
//               Package
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
//               Time Slot
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
//               Advance
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
//               Total Amount
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty">
//               Contact
//             </TableHead>
//             <TableHead className="hidden max-sm:flex items-center align-bottom h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty">
//               Count
//             </TableHead>
//             <TableHead className="h-16 text-center max-sm:text-[9px] font-bold max-sm:text-pretty max-sm:hidden">
//               Payment Mode
//             </TableHead>

//             <TableHead className="w-[50px]"></TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {bookings && bookings.length > 0 ? (
//             bookings.map((booking, index) => {
//               const formattedDate = format(
//                 new Date(booking.createdAt ?? Date.now()),
//                 "dd/MM/yyyy",
//               );
//               const totalCount =
//                 booking.numOfAdults + booking.numOfChildren + booking.numOfBaby;

//               // Get time slot using the utility function
//               const { fromTime, toTime } =
//                 selectFromTimeAndToTimeFromScheduleOrPackages({
//                   Packages: {
//                     packageFromTime: booking.schedule.Package?.fromTime ?? "",
//                     packageToTime: booking.schedule.Package?.toTime ?? "",
//                   },
//                   schedule: {
//                     scheduleFromTime: booking.schedule.fromTime,
//                     scheduleToTime: booking.schedule.toTime,
//                   },
//                 });

//               const timeSlot = `${fromTime} - ${toTime}`;

//               return (
//                 <TableRow
//                   key={`recent-booking-${booking.id}-${index}`}
//                   className="cursor-pointer hover:bg-muted/50"
//                 >
//                   <TableCell className="text-center max-sm:text-[9px] max-sm:p-1">
//                     {index + 1}
//                   </TableCell>

//                   <TableCell className="text-left max-sm:text-[9px] max-sm:p-1">
//                     <div className="flex flex-col">
//                       <span className="font-medium max-sm:text-nowrap">
//                         {booking.user.name}
//                       </span>
//                       <span className="text-xs text-muted-foreground max-sm:hidden">
//                         {booking.user.email}
//                       </span>
//                     </div>
//                   </TableCell>

//                   <TableCell className="text-center max-sm:text-[9px] max-sm:p-1">
//                     {formattedDate}
//                   </TableCell>
//                   <TableCell className="text-center max-sm:text-[9px] max-sm:hidden">
//                     <Badge variant="outline" className="text-xs">
//                       {format(
//                         new Date(booking.schedule.day ?? Date.now()),
//                         "dd/MM/yyyy",
//                       )}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-center max-sm:text-[9px] max-sm:p-1">
//                     {booking.schedule.Package?.title || "N/A"}
//                   </TableCell>

//                   <TableCell className="text-center max-sm:text-[9px] max-sm:hidden">
//                     <span className="text-sm">{timeSlot}</span>
//                   </TableCell>

//                   <TableCell className="text-center max-sm:text-[9px] max-sm:hidden">
//                     <span className="font-medium ">
//                       ₹{booking.payment.advancePaid.toLocaleString()}
//                     </span>
//                   </TableCell>

//                   <TableCell className="text-center max-sm:text-[9px] max-sm:hidden">
//                     <span className="font-medium text-green-500">
//                       ₹{booking.payment.totalAmount.toLocaleString()}
//                     </span>
//                   </TableCell>

//                   <TableCell className="text-center max-sm:text-[9px] max-sm:p-1">
//                     {booking.user.contact}
//                   </TableCell>

//                   {/* Mobile count column */}
//                   <TableCell className="hidden max-sm:block max-sm:text-[9px] text-center">
//                     <Badge variant="outline" className="text-[8px]">
//                       {totalCount}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-center max-sm:text-[9px] max-sm:hidden">
//                     <Badge
//                       variant={
//                         booking.payment.modeOfPayment === "ONLINE"
//                           ? "default"
//                           : "secondary"
//                       }
//                       className="text-xs"
//                     >
//                       {booking.payment.modeOfPayment}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="max-sm:p-1">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0"
//                         >
//                           <EllipsisVertical size={16} />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="w-48">
//                         {resendEmail && (
//                           <DropdownMenuItem
//                             onClick={() => resendEmail(booking.id)}
//                             className="cursor-pointer"
//                           >
//                             <Mail className="mr-2 h-4 w-4" />
//                             Resent Email
//                           </DropdownMenuItem>
//                         )}
//                         {viewBooking && (
//                           <DropdownMenuItem
//                             onClick={() => viewBooking(booking.scheduleId)}
//                             className="cursor-pointer"
//                           >
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Booking
//                           </DropdownMenuItem>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               );
//             })
//           ) : (
//             <TableRow>
//               <TableCell
//                 colSpan={15}
//                 className="text-center py-8 text-muted-foreground"
//               >
//                 No recent bookings found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
