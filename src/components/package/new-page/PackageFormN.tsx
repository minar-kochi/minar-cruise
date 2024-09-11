"use client";

import { trpc } from "@/app/_trpc/client";
import { phoneNumberParser } from "@/lib/helpers/CommonBuisnessHelpers";
import { ParseScheduleConflicError } from "@/lib/TRPCErrorTransformer/utils";
import { absoluteUrl, RemoveTimeStampFromDate } from "@/lib/utils";
import {
  onlineBookingFormValidator,
  TOnlineBookingFormValidator,
} from "@/lib/validators/onlineBookingValidator";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import BookingFormCalender from "./BookingFormCalender";
import ColorRepresentationInfo from "./ColorRepresentationInfo";
import BookingFormCard from "./BookingFormCard";
import PackageScheduleDialogs from "@/components/packages/PackageScheduleDialogs";
import { Button } from "@/components/ui/button";

type TPackageForm = {
  packageId: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
  adultPrice: number;
  childPrice: number;
};

export default function PackageFormN({
  packageId,
  packageCategory,
  adultPrice,
  childPrice,
}: TPackageForm) {
  const [ScheduleError, setScheduleError] =
    useState<ScheduleConflictError | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm<TOnlineBookingFormValidator>({
    resolver: zodResolver(onlineBookingFormValidator),
    defaultValues: {
      numOfAdults: 0,
      numOfChildren: 0,
      numOfBaby: 0,
      packageId: packageId,
      selectedScheduleDate: RemoveTimeStampFromDate(new Date(Date.now())),
      packageCategory: packageCategory,
    },
  });

  const { mutate: CreateRazorPayIntent, isPending } =
    trpc.user.createRazorPayIntent.useMutation({
      onMutate() {
        toast.loading("creating razorpay intend");
      },
      // @HOTFIX check callback url before deployment
      async onSuccess(res) {
        toast.dismiss();
        const notes = res?.order.notes!;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEYID,
          name: notes?.name ?? undefined,
          currency: "INR",
          amount: res?.order?.amount,
          order_id: res?.order.id,
          callback_url: absoluteUrl(`/success?email=${""}&time="07*10*2001"`),
          prefill: {
            name: notes.name ?? undefined,
            phone: phoneNumberParser(
              res?.phone ? res.phone.toString() : undefined,
            ),
          },
        };
        const paymentModal = new window.Razorpay(options);
        paymentModal.open();
        paymentModal.on("success", function (data: any) {
          console.log(data);
          alert("Payment failed. Please try again.");
          toast.error("payment failed");
        });

        toast.success("intend created successfully");
      },
      onError(error, variables, context) {
        toast.dismiss();
        if (error.data?.code === "CONFLICT") {
          try {
            const message = error.message;
            const ParsedMessage = ParseScheduleConflicError(message);
            if (!ParsedMessage) {
              toast.error(message, {
                duration: 6000,
                ariaProps: {
                  "aria-live": "polite",
                  role: "alert",
                },
              });
              return;
            }
            toast.error(ParsedMessage.message, {
              duration: 6000,
              ariaProps: {
                "aria-live": "polite",
                role: "alert",
              },
            });
            setIsOpen(true);
            setScheduleError(ParsedMessage);
            return;
          } catch (error) {
            console.log(error);
            toast.error("something went wrong");
            return;
          }
        }
        toast.error(error.message, {
          duration: 6000,
          ariaProps: {
            "aria-live": "polite",
            role: "alert",
          },
        });
      },
    });

  async function onSubmit(data: TOnlineBookingFormValidator) {
    try {
      CreateRazorPayIntent(data);
    } catch (error) {
      if (error instanceof zodResolver) {
        console.log("Zod validation error");
      }
    }
  }

  const numofAdults = watch("numOfAdults");
  const numOfChild = watch("numOfChildren");
  const numOfInfant = watch("numOfBaby");
  const date = watch("selectedScheduleDate");
  const total =
    numofAdults * (adultPrice / 100) + numOfChild * (childPrice / 100);
  return (
    <article className="flex flex-col pt-2  items-center justify-center">
      <p className="font-semibold text-lg pb-4  ">
        Check Cruise
        <span className="text-red-500 "> Availability </span>
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center"
      >
        <BookingFormCalender
          setFormDateValue={(value: string) => {
            setValue("selectedScheduleDate", value);
          }}
          setScheduleId={(value: string | undefined) => {
            setValue("scheduleId", value);
          }}
          packageId={packageId}
        />
        <div className="flex flex-col items-center justify-center gap-2 ">
          <div className="flex gap-2">
            <ColorRepresentationInfo className="bg-muted " title="Blocked" />
            <ColorRepresentationInfo
              className="bg-green-600 "
              title="Available"
            />
          </div>
          <ColorRepresentationInfo
            className="bg-white border "
            title="Rest of the days Minimum 25 Pax"
          />
        </div>
        <div className="my-5 h-[2px] w-[95%] bg-black" />
        <BookingFormCard
          getValues={getValues}
          setValues={setValue}
          watch={watch}
          register={register}
          errors={errors}
        />
        <div className="flex w-full  justify-evenly items-center">
          <div>
            <p className="text-xs ">Total:</p>
            <p className="text-2xl font-semibold ">₹{total}</p>
          </div>
          <div className="w-[2px] h-12 bg-black"></div>
          <div>
            <Button>Book Now</Button>
          </div>
        </div>
      </form>
      <PackageScheduleDialogs
        ScheduleError={ScheduleError}
        isOpen={isOpen}
        selectedDate={new Date(getValues("selectedScheduleDate"))}
        setIsOpen={setIsOpen}
      />
    </article>
  );
}
