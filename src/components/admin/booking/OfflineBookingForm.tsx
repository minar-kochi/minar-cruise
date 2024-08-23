"use client";

import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  offlineBookingFormSchema,
  TOfflineBookingFormSchema,
} from "@/lib/validators/offlineBookingValidator";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { TGetBookedDetails } from "@/db/data/dto/booking";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * accept a type prop which will be notified as update / add ENUM
 *
 * if the type is update then show update button
 * abstract the button to be a independed.
 *
 * if the type is UPDATE then show the update button
 * and do update button logic.
 *
 * if the type is ADD then show the add button
 * and do add button logic.
 * @returns
 */

type TOfflineBookingForm = {
  // remove "?"  after fixing on other pages.
  type: "ADD" | "UPDATE";
  scheduleId: string;
  // accept a booking data
  prefillData?: TGetBookedDetails;
};

export default function OfflineBookingForm({
  scheduleId,
  type,
  prefillData,
}: TOfflineBookingForm) {
  const { invalidate: InvalidateBookingSchedule } =
    trpc.useUtils().admin.booking.bookingScheduleInfinity;
  const { mutate: createOfflineBooking, isPending: isLoading } =
    trpc.admin.booking.createNewOfflineBooking.useMutation({
      onMutate() {
        toast.loading(`Adding booking data`);
      },
      async onSuccess() {
        toast.dismiss();
        reset();
        toast.success("Successfully added booking data");
        await InvalidateBookingSchedule(undefined, {
          type: "all",
        });
        router.prefetch(`/admin/booking/view/${scheduleId}`);
        router.push(`/admin/booking/view/${scheduleId}`);
      },
      onError(error) {
        toast.dismiss();
        toast.error(error.message);
      },
    });
  const router = useRouter();
  const { mutate: mutateUpdatedBooking, isPending: isUpdatingLoading } =
    trpc.admin.booking.updateOfflineBooking.useMutation({
      onMutate() {
        toast.loading(`Adding booking data`);
      },
      async onSuccess(data) {
        await InvalidateBookingSchedule(undefined, {
          type: "all",
        });
        toast.dismiss();
        toast.success("Successfully added booking data");
        await InvalidateBookingSchedule(undefined, {
          type: "all",
        });

        router.prefetch(`/admin/booking/view/${scheduleId}`);
        router.push(`/admin/booking/view/${scheduleId}`);
      },
      onError(error) {
        toast.dismiss();
        toast.error(error.message);
      },
    });

  const onSubmit = (data: TOfflineBookingFormSchema) => {
    if (type === "ADD") {
      createOfflineBooking(data);
      return;
    }
    if (!prefillData?.id) {
      toast.error("Please refresh the page, or go to correct booking id page.");
      return;
    }
    if (!isDirty) {
      toast.error("Please Change any values to be updated.");
      return;
    }
    mutateUpdatedBooking({
      bookingId: prefillData.id,
      ...data,
    });
  };
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<TOfflineBookingFormSchema>({
    resolver: zodResolver(offlineBookingFormSchema),
    defaultValues: {
      /**allow to use the value to be included on the server send id */
      schedule: scheduleId,
      // prefill the data that is passed
      adultCount: prefillData?.numOfAdults,
      childCount: prefillData?.numOfChildren,
      description: prefillData?.description,
      discount: prefillData?.payment.discount,
      advanceAmount: prefillData?.payment.advancePaid,
      babyCount: prefillData?.numOfBaby,
      billAmount: prefillData?.payment.totalAmount,
      paymentMode: prefillData?.payment.modeOfPayment,
      email: prefillData?.user.email ?? undefined,
      name: prefillData?.user.name,
      phone: prefillData?.user.contact ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5">
      <h1 className="text-3xl font-bold max-w-max mx-auto my-10">
        {type === "ADD" ? "Add Booking" : "Update Booking"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        <InputLabel
          label="Name"
          InputProps={{
            placeholder: "Enter name",
            required: true,
            ...register("name"),
          }}
          errorMessage={errors.name ? `${errors.name.message}` : null}
        />
        <InputLabel
          label="Phone"
          InputProps={{
            type: "number",
            placeholder: "Enter Phone number",
            ...register("phone"),
          }}
          errorMessage={errors.phone ? `${errors.phone.message}` : null}
        />
        <InputLabel
          containerClassName=""
          label="Email"
          InputProps={{
            type: "email",
            placeholder: "example@gmail.com",
            ...register("email"),
          }}
          errorMessage={
            errors.email?.message ? `${errors.email.message}` : null
          }
        />
        {/* <InputLabel
          containerClassName="hidden"
          label="Schedule"
          InputProps={{
            type: "text",
            className: "hidden",
            placeholder: "Select a schedule",
            required: true,
            ...register("schedule", {
              value: scheduleId,
            }),
          }}
          errorMessage={
            errors.schedule?.message ? `${errors.schedule.message}` : null
          }
        /> */}
        <InputLabel
          label="Adult Count"
          InputProps={{
            type: "number",
            placeholder: "Enter Adult count",
            min: 0,
            ...register("adultCount", { valueAsNumber: true }),
          }}
          errorMessage={
            errors.adultCount?.message ? `${errors.adultCount.message}` : null
          }
        />
        <InputLabel
          label="Child Count"
          InputProps={{
            min: 0,
            type: "number",
            placeholder: "Enter a Child Count",
            ...register("childCount", { valueAsNumber: true }),
          }}
          errorMessage={
            errors.childCount?.message ? `${errors.childCount.message}` : null
          }
        />
        <InputLabel
          label="Baby Count"
          InputProps={{
            min: 0,
            type: "number",
            placeholder: "Enter a baby Count",
            ...register("babyCount", { valueAsNumber: true }),
          }}
          errorMessage={
            errors.babyCount?.message ? `${errors.babyCount.message}` : null
          }
        />
        <InputLabel
          label="Discount"
          InputProps={{
            min: 0,
            type: "number",
            defaultValue: 0,
            placeholder: "Enter a Discount in rupee",
            ...register("discount", { valueAsNumber: true }),
          }}
          errorMessage={
            errors.discount?.message ? `${errors.discount.message}` : null
          }
        />
        <InputLabel
          label="Payment mode"
          InputProps={{
            type: "text",
            placeholder: "eg: GPAY, CASH, PAYTM",
            ...register("paymentMode"),
          }}
          errorMessage={
            errors.paymentMode?.message ? `${errors.paymentMode.message}` : null
          }
        />
        <InputLabel
          label="Advance amount"
          InputProps={{
            min: 0,
            type: "number",
            placeholder: "Enter received amount in rupee",
            ...register("advanceAmount", { valueAsNumber: true }),
          }}
          errorMessage={
            errors.advanceAmount?.message
              ? `${errors.advanceAmount.message}`
              : null
          }
        />
        <InputLabel
          label="Total fare"
          InputProps={{
            min: 0,
            type: "number",
            placeholder: "Enter total fare",
            ...register("billAmount", { valueAsNumber: true }),
          }}
          errorMessage={
            errors.billAmount?.message ? `${errors.billAmount.message}` : null
          }
        />
        <InputLabel
          label="Description"
          InputProps={{
            type: "text",
            placeholder: "Enter a description, eg: Via Aslu",
            ...register("description"),
          }}
          errorMessage={
            errors.description?.message ? `${errors.description.message}` : null
          }
        />
      </div>
      <div className="py-5">
        {type === "ADD" ? (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading ? <Loader2 /> : "Add"}
          </Button>
        ) : (
          <Button type="submit" className="w-full" disabled={!isDirty}>
            {isUpdatingLoading ? <Loader2 /> : "Update"}
          </Button>
        )}
      </div>
    </form>
  );
}

// const AddButton = () => {
//   return <Button disabled={}>
//     Add
//   </Button>
// }
