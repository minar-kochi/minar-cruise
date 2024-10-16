"use client";

import { trpc } from "@/app/_trpc/client";
import { phoneNumberParser } from "@/lib/helpers/CommonBuisnessHelpers";
import { ParseScheduleConflicError } from "@/lib/TRPCErrorTransformer/utils";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { absoluteUrl, cn, RemoveTimeStampFromDate } from "@/lib/utils";
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
import { isPackageStatusSunSet } from "@/lib/validators/Package";
import { format } from "date-fns";
import { dataTagSymbol } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

type TPackageForm = {
  packageId: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
  adultPrice: number;
  childPrice: number;
  type?: "modal" | undefined;
};

export default function PackageFormN({
  packageId,
  packageCategory,
  adultPrice,
  childPrice,
  type,
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
      // token: undefined,
    },
  });
  const safeTotal = (value: number) => {
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  };

  const { mutate: CreateRazorPayIntent, isPending } =
    trpc.user.createRazorPayIntent.useMutation({
      onMutate() {
        toast.loading("Confirming Schedule...");
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
          callback_url: absoluteUrl(
            `/success?email=${res.email}&time=${format(new Date(getValues("selectedScheduleDate") ?? ""), "iii dd-MM-yyyy") ?? ""}`,
          ),
          prefill: {
            name: notes.name ?? undefined,
            phone: phoneNumberParser(
              res?.phone ? res?.phone?.toString() : undefined,
            ),
          },
        };
        const paymentModal = new window.Razorpay(options);
        paymentModal.open();
      },
      onError(error, variables, context) {
        toast.dismiss();
        if (
          error instanceof TRPCClientError &&
          error.data?.code === "CONFLICT"
        ) {
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
            toast.error(ParsedMessage?.message, {
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
            toast.error("something went wrong");
            return;
          }
        }
        if (error instanceof TRPCClientError) {
          toast.error(error.message, {
            duration: 6000,
            ariaProps: {
              "aria-live": "polite",
              role: "alert",
            },
          });
        }
      },
    });
  const { executeRecaptcha } = useGoogleReCaptcha();

  async function onSubmit(data: TOnlineBookingFormValidator) {
    try {
      if (typeof executeRecaptcha === "undefined") {
        toast.error(
          "Recaptcha hasn't Loaded,Please turn on script or Try again",
        );
        return;
      }
      const token = await executeRecaptcha("OrderSubmitted");
      if (!token || !token.length) {
        toast.error("Recaptcha has not loaded Yet");
        return;
      }
      CreateRazorPayIntent({ ...data, token });
    } catch (error) {
      console.log(error);
      if (error instanceof zodResolver) {
        console.log("Validation error has occured");
      }
      toast.error("Something unexpected happened");
    }
  }

  const numofAdults = watch("numOfAdults");
  const numOfChild = watch("numOfChildren");
  const numOfInfant = watch("numOfBaby");
  const date = watch("selectedScheduleDate");
  const total =
    numofAdults * (adultPrice / 100) + numOfChild * (childPrice / 100);

  return (
    <article className="flex flex-col pt-3  items-center justify-center pb-5 w-full ">
      <p
        className={cn("font-semibold text-lg py-1", {
          "pb-5 font-bold text-xl": type === "modal",
        })}
      >
        Check Cruise
        <span className="text-red-500 "> Availability </span>
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col items-center w-full justify-center")}
      >
        <div
          className={
            cn(" border border-blue-300 bg-white px-4 mt-4 rounded-2xl",
            {
              hidden: type,
            })
          }
        >
          <div>{format(date, "iii dd/MM/yyyy")}</div>
        </div>
        <BookingFormCalender
          setFormDateValue={(value: string) => {
            setValue("selectedScheduleDate", value);
          }}
          setScheduleId={(value: string | undefined) => {
            setValue("scheduleId", value);
          }}
          packageId={packageId}
          packageCategory={packageCategory}
          {...(type === "modal" && { popoverCalender: true, className: "" })}
        />
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 mt-5 ",
          )}
        >
          <div className="flex gap-2">
            <div>
              <ColorRepresentationInfo className="bg-muted  " title="Blocked" />
            </div>
            <div
              className={cn({
                hidden: isPackageStatusSunSet({
                  packageStatus: packageCategory,
                }),
              })}
            >
              <ColorRepresentationInfo
                className={cn("bg-green-600 ")}
                title="Available"
              />
            </div>
          </div>
          <div
            className={cn({
              hidden: isPackageStatusSunSet({
                packageStatus: packageCategory,
              }),
            })}
          >
            <ColorRepresentationInfo
              className={cn("bg-white border")}
              title="Rest of the days Minimum 25 Pax"
            />
          </div>
        </div>
        {type ? null : <div className="m-7 h-[1px] w-[100%] bg-gray-300" />}

        <BookingFormCard
          getValues={getValues}
          setValues={setValue}
          watch={watch}
          register={register}
          errors={errors}
          adultPrice={adultPrice / 100}
          childPrice={childPrice / 100}
          className={cn("", { "": type === "modal" })}
        />
        <div className={cn("flex w-full mt-3 justify-evenly items-center ")}>
          <div>
            <p className="text-xs">Total:</p>
            <p className="text-2xl font-semibold ">₹{safeTotal(total)}</p>
          </div>
          <div className="w-[2px] h-12 bg-black"></div>
          <div>
            <Button
              type="submit"
              className="w-full text-white"
              variant={"default"}
              disabled={isSubmitting || isPending}
            >
              Pay Now
            </Button>
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
