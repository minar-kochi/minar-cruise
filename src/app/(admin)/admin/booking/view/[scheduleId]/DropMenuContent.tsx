"use client";
import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteBookingButton from "@/components/admin/booking/DeleteBookingButton";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { TRPCError } from "@trpc/server";

export default function DropMenuClient({
  BookingId,
  scheduleId,
}: {
  BookingId: string;
  scheduleId: string;
}) {
  const { mutate: resendEmailMutation, isPending: isResendingEmail } =
    trpc.admin.booking.resendConfirmationEmail.useMutation({
      onSuccess(data, variables, context) {
        if (data.isAdminFailed) {
          toast.error("Failed to send email to admin, but was sent user.");
        } else {
          toast.success("Email sent successfully!");
        }
      },
      onError(error, variables, context) {
        if (error instanceof TRPCError) {
          toast.error(error.message);
          return;
        }
        toast.error("Failed to send email. Please try again.");
      },
    });
  const resendEmail = (bookingId: string) => {
    if (isResendingEmail) return;

    const loadingToast = toast.loading("Sending email...");
    resendEmailMutation(
      { bookingId },
      {
        onSettled: () => {
          toast.dismiss(loadingToast);
        },
      },
    );
  };
  return (
    <DropdownMenuContent align="end" className="">
      <DropdownMenuItem>
        <Link href={`/admin/booking/update/${BookingId}`}>Update Booking</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <button
          onClick={() => {
            resendEmail(BookingId);
          }}
        >
          Resend email
        </button>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link
          href={{
            pathname: `/admin/booking/change/${BookingId}`,
            query: { scheduleId },
          }}
        >
          Change Booking
        </Link>
      </DropdownMenuItem>
      <DeleteBookingButton BookingId={BookingId} ScheduleId={scheduleId} />
    </DropdownMenuContent>
  );
}
