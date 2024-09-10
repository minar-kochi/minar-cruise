"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import BookingFormCalender from "./BookingFormCalender";
import ColorRepresentationInfo from "./ColorRepresentationInfo";
import { useForm } from "react-hook-form";
import {
  onlineBookingFormValidator,
  TOnlineBookingFormValidator,
} from "@/lib/validators/onlineBookingValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft, SendToBackIcon } from "lucide-react";
import BookingFormCard from "./BookingFormCard";
import { absoluteUrl, RemoveTimeStampFromDate } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { phoneNumberParser } from "@/lib/helpers/CommonBuisnessHelpers";
import { ParseScheduleConflicError } from "@/lib/TRPCErrorTransformer/utils";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import PackageScheduleDialogs from "@/components/packages/PackageScheduleDialogs";
import { TGetPackageById } from "@/db/data/dto/package";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
type TPackageForm = {
  packageId: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
  adultPrice: number;
  childPrice: number;
};
export default function PackageForm({
  packageId,
  packageCategory,
  adultPrice,
  childPrice,
}: TPackageForm) {
  const [ScheduleError, setScheduleError] =
    useState<ScheduleConflictError | null>(null);

  const [isNext, setIsNext] = useState(false);
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
    <article className=" sm:pl-2 ">
      <div className=" max-w-sm mx-auto">
        <h3 className="text-xl  font-medium">Check Dates & Availability</h3>
        <p className="text-sm text-muted-foreground">
          Choose a date to check availability and reserve your spot for the
          cruise.{" "}
        </p>
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
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex  flex-col items-center justify-center "
      >
        {!isNext ? (
          <BookingFormCalender
            setFormDateValue={(value: string) => {
              setValue("selectedScheduleDate", value);
            }}
            setScheduleId={(value: string | undefined) => {
              setValue("scheduleId", value);
            }}
            packageId={packageId}
          />
        ) : (
          <BookingFormCard
            getValues={getValues}
            setValues={setValue}
            watch={watch}
            register={register}
            errors={errors}
          />
        )}
        {/* <div className="w-full flex items-center justify-center flex-col">
          <div className="w-full max-w-sm mt-3 bg-gray-900 p-2 text-white rounded-md">
            <Checkbox required />
          </div>
        </div> */}
        {!isNext ? (
          <Button
            onClick={() => {
              setIsNext(true);
            }}
            className="w-full relative z-10 max-w-sm mt-2"
          >
            Fill in Booking form {format(new Date(date), "do/MMM")}
          </Button>
        ) : null}

        {isNext ? (
          <>
            <div className="w-full flex items-center justify-center flex-col">
              <div className="w-full max-w-sm mt-3 bg-slate-800 p-2 text-white rounded-md">
                <p className="font-medium">
                  Total : ₹{total}
                  <sup className="text-green-400 font-medium">
                    * GST Included
                  </sup>
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 max-w-sm w-full">
              <Button
                onClick={() => {
                  setIsNext(false);
                }}
                variant={"secondary"}
                // className="max-w-fit p-2 border border-black "
              >
                <ChevronLeft />
                <p>Back</p>
              </Button>
              <Button
                type="submit"
                className="w-full text-white"
                variant={"default"}
              >
                Book now {total ? `@ ₹${total}` : null}
              </Button>
            </div>
          </>
        ) : null}
      </form>
      <PackageScheduleDialogs
        isNextSlideState={setIsNext}
        ScheduleError={ScheduleError}
        isOpen={isOpen}
        selectedDate={new Date(getValues("selectedScheduleDate"))}
        setIsOpen={setIsOpen}
      />
    </article>
  );
}
