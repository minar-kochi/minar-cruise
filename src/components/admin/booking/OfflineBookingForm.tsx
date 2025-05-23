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
import { isProd, sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import PrefillButton from "./PrefillButton";

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
    trpc.useUtils().admin.booking;
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
        /**@todo remove this and add infinity table in booking page. */
        await sleep(1000);
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
    setValue
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <h1 className="text-5xl font-extrabold">
          {type === "ADD" ? "Add Booking" : "Update Booking"}
        </h1>
      <div className="flex justify-between items-center">
        <p className="">Offline Booking Form</p>
        {(type==='ADD' && !isProd) ? <PrefillButton setValue={setValue} />: null}
      </div>  
      <div className="w-full border-b border-gray-200 my-5"></div>
      <div className="grid grid-cols-3 max-md:flex max-md:flex-col gap-3 ">
        <div className="col-span-2 flex flex-col justify-between ">
          <div className="grid grid-cols-2 gap-4 ">
            <InputLabel
              containerClassName="space-y-2"
              label="Name"
              InputProps={{
                placeholder: "Enter name",
                className: "bg-muted placeholder:tracking-wider",
                required: true,
                ...register("name"),
              }}
              errorMessage={errors.name ? `${errors.name.message}` : null}
            />
            <InputLabel
              containerClassName="space-y-2"
              label="Phone"
              InputProps={{
                type: "number",
                className: "bg-muted placeholder:tracking-wider",
                placeholder: "Enter Phone number",
                ...register("phone"),
              }}
              errorMessage={errors.phone ? `${errors.phone.message}` : null}
            />
          </div>
          <InputLabel
            containerClassName="space-y-2"
            label="Email"
            InputProps={{
              type: "email",
              className: "bg-muted placeholder:tracking-wider",
              placeholder: "example@gmail.com",
              ...register("email"),
            }}
            errorMessage={
              errors.email?.message ? `${errors.email.message}` : null
            }
          />

          <div className="grid grid-cols-3 gap-3 max-md:flex max-md:flex-col ">
            <div className="col-span-1">
              <div className="flex flex-col items-start ">
                <div className="mt-4 w-full">
                  <InputLabel
                    containerClassName="space-y-2"
                    label="Adult Count"
                    InputProps={{
                      type: "number",
                      className: "bg-muted placeholder:tracking-wider",
                      placeholder: "Enter Adult count",
                      min: 0,
                      ...register("adultCount", { valueAsNumber: true }),
                    }}
                    errorMessage={
                      errors.adultCount?.message
                        ? `${errors.adultCount.message}`
                        : null
                    }
                  />
                </div>
                <div className="mt-4 w-full">
                  <InputLabel
                    containerClassName="space-y-2"
                    label="Child Count"
                    InputProps={{
                      min: 0,
                      type: "number",
                      className: "bg-muted placeholder:tracking-wider",
                      placeholder: "Enter a Child Count",
                      ...register("childCount", { valueAsNumber: true }),
                    }}
                    errorMessage={
                      errors.childCount?.message
                        ? `${errors.childCount.message}`
                        : null
                    }
                  />
                </div>
                <div className="mt-4 w-full">
                  <InputLabel
                    containerClassName="space-y-2"
                    label="Baby Count"
                    InputProps={{
                      min: 0,
                      type: "number",
                      className: "bg-muted placeholder:tracking-wider",
                      placeholder: "Enter a baby Count",
                      ...register("babyCount", { valueAsNumber: true }),
                    }}
                    errorMessage={
                      errors.babyCount?.message
                        ? `${errors.babyCount.message}`
                        : null
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex flex-col items-start ">
                <div className="mt-4 w-full">
                  <InputLabel
                    containerClassName="space-y-2"
                    label="Discount"
                    InputProps={{
                      min: 0,
                      type: "number",
                      defaultValue: 0,
                      className: "bg-muted placeholder:tracking-wider",
                      placeholder: "Enter a Discount in rupee",
                      ...register("discount", { valueAsNumber: true }),
                    }}
                    errorMessage={
                      errors.discount?.message
                        ? `${errors.discount.message}`
                        : null
                    }
                  />
                </div>
                <div className="mt-4 w-full">
                  <InputLabel
                    containerClassName="space-y-2"
                    label="Payment mode"
                    InputProps={{
                      type: "text",
                      className: "bg-muted placeholder:tracking-wider",
                      placeholder: "eg: GPAY, CASH, PAYTM",
                      ...register("paymentMode"),
                    }}
                    errorMessage={
                      errors.paymentMode?.message
                        ? `${errors.paymentMode.message}`
                        : null
                    }
                  />
                </div>
                <div className=" w-full flex justify-between gap-3">
                  <div className="mt-4 w-full">
                    <InputLabel
                      labelClassName="overflow-clip"
                      containerClassName="space-y-2"
                      label="Advance amount"
                      InputProps={{
                        min: 0,
                        type: "number",
                        className: "bg-muted placeholder:tracking-wider",
                        placeholder: "Enter received amount in rupee",
                        ...register("advanceAmount", { valueAsNumber: true }),
                      }}
                      errorMessage={
                        errors.advanceAmount?.message
                          ? `${errors.advanceAmount.message}`
                          : null
                      }
                    />
                  </div>
                  <div className="mt-4 w-full">
                    <InputLabel
                      containerClassName="space-y-2 "
                      label="Total fare"
                      InputProps={{
                        min: 0,
                        type: "number",
                        placeholder: "Enter total fare",
                        className: "bg-muted placeholder:tracking-wider",
                        ...register("billAmount", { valueAsNumber: true }),
                      }}
                      errorMessage={
                        errors.billAmount?.message
                          ? `${errors.billAmount.message}`
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 ">
          <InputLabel
            containerClassName="my-0"
            label="Description"
            errorMessage={
              errors.description?.message
                ? `${errors.description.message}`
                : null
            }
            InputBox="textarea"
            TextAreaProps={{
              placeholder: "Enter a description, eg: Via Aslu",
              ...register("description"),
            }}
            TextAreaClassName="mt-3 bg-neutral-900 min-h-[440px] bg-muted placeholder:tracking-wider"
          />
        </div>
      </div>

      <div className="flex justify-between mt-3">
        {type === "ADD" ? (
          <div className="flex justify-between w-full gap-4">
            <Button
              className="bg-red-700 hover:bg-red-800 dark:text-white font-semibold"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className=" bg-green-700 text-white hover:bg-green-800 w-full max-w-[520px]"
              disabled={isSubmitting}
            >
              {isLoading ? <Loader2 /> : "Add"}
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              className="bg-green-700 text-white hover:bg-green-800 w-full max-w-[520px]"
              disabled={!isDirty}
            >
              {isUpdatingLoading ? <Loader2 /> : "Update"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
