"use client";

import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  offlineBookingSchema,
  TOfflineBookingSchema,
} from "@/lib/validators/offlineBookingValidator";
import { trpc } from "@/app/_trpc/client";
import { Toast } from "@/components/ui/toast";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function OfflineBookingForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TOfflineBookingSchema>({
    resolver: zodResolver(offlineBookingSchema),
  });

  const { mutate: createOfflineBooking, isPending: isLoading } =
    trpc.admin.booking.createNewOfflineBooking.useMutation({
      onMutate() {
        toast.loading(`Adding booking data`);
      },
      onSuccess() {
        toast.dismiss();
        reset();
        toast.success("Successfully added booking data");
      },
      onError(error, variables, context) {
        toast.dismiss();
        toast.error(error.message);
        
      },
      // onError() {
      //   toast.error("Something went wrong");
      // },
    });

  const onSubmit = async (data: TOfflineBookingSchema) => {
    try {
      createOfflineBooking(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10 ">
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
        <InputLabel
          label="Schedule"
          InputProps={{
            type: "text",
            placeholder: "Select a schedule",
            required: true,
            ...register("schedule"),
          }}
          errorMessage={
            errors.schedule?.message ? `${errors.schedule.message}` : null
          }
        />
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
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isLoading ? (
            <>
              <Loader2 />
            </>
          ) : (
            "Add booking"
          )}
        </Button>
      </div>
    </form>
  );
}
