import { trpc } from "@/app/_trpc/client";
import BookingFormCard from "@/components/package/new-page/BookingFormCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { TGetPackageSearchItems } from "@/db/data/dto/package";
import { phoneNumberParser } from "@/lib/helpers/CommonBuisnessHelpers";
import { ParseScheduleConflicError } from "@/lib/TRPCErrorTransformer/utils";
import {
  absoluteUrl,
  cn,
  RemoveTimeStampFromDate,
  safeTotal,
} from "@/lib/utils";
import {
  onlineBookingFormValidator,
  TOnlineBookingFormValidator,
} from "@/lib/validators/onlineBookingValidator";
import { TSchedulesData } from "@/Types/Schedule/ScheduleSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { format } from "date-fns";
import React from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
type TPackageSelectCard = {
  item: TGetPackageSearchItems[number];
  schedules: TSchedulesData;
};

export default function QuickPackageForm({
  item,
  schedules,
}: TPackageSelectCard) {
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
      packageId: item.id,
      selectedScheduleDate: RemoveTimeStampFromDate(new Date(schedules.day)),
      packageCategory: item.packageCategory,
      scheduleId: schedules.id,
    },
  });

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
            // setIsOpen(true);
            // setScheduleError(ParsedMessage);
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
  const numofAdults = watch("numOfAdults");
  const numOfChild = watch("numOfChildren");
  const numOfInfant = watch("numOfBaby");
  const total =
    numofAdults * (item.adultPrice / 100) +
    numOfChild * (item.childPrice / 100);
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
  return (
    <Dialog>
      <DialogTrigger className="" asChild>
        <Button className="flex w-full md:w-auto rounded-md px-3 py-3 ">
          Book now
        </Button>

        {/* <button className=" absolute top-0 bottom-0 left-0  w-full h-full" /> */}
      </DialogTrigger>
      <DialogContent className="max-w-[95%] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book your Cruise Now</DialogTitle>
          <DialogDescription className="font-semibold text-black">
            Confirm package <span className="text-primary">{item.title}</span>{" "}
            on {format(new Date(schedules.day), "EEEE dd,yyyy")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BookingFormCard
            getValues={getValues}
            setValues={setValue}
            watch={watch}
            register={register}
            errors={errors}
            adultPrice={item.adultPrice / 100}
            childPrice={item.childPrice / 100}
            //   className={cn("", { "": type === "modal" })}
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
      </DialogContent>
    </Dialog>
  );
}
