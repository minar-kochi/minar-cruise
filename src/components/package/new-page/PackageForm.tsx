"use client";

import { trpc } from "@/app/_trpc/client";
import PackageScheduleDialogs from "@/components/packages/PackageScheduleDialogs";
import { Button } from "@/components/ui/button";
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
import { isPackageStatusSunSet } from "@/lib/validators/Package";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import BookingFormCalender from "./BookingFormCalender";
import BookingFormCard from "./BookingFormCard";
import ColorRepresentationInfo from "./ColorRepresentationInfo";
import {
  useClientSelector,
  useClientStore,
} from "@/hooks/clientStore/clientReducers";
import { getPackageById } from "@/lib/features/client/packageClientSelectors";
import { setDate } from "@/lib/features/client/packageClientSlice";

type TPackageForm = {
  packageId: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
  adultPrice: number;
  childPrice: number;
  type?: "modal" | undefined;
  defaultDate?: string;
  scheduleId?: string;
};

export default function PackageFormN({
  packageId,
  packageCategory,
  adultPrice,
  childPrice,
  type,
  defaultDate,
}: TPackageForm) {
  const store = useClientStore();
  const initialized = useRef(false);

  if (!initialized.current) {
    if (defaultDate?.length) {
      console.log("DEFAULT DATE",defaultDate)
      store.dispatch(setDate(defaultDate));
    }
    initialized.current = true;
  }

  const [ScheduleError, setScheduleError] =
    useState<ScheduleConflictError | null>(null);

  const [isOpen, setIsOpen] = useState(false);
 const date = useClientSelector((state)=> state.package.date)
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
      selectedScheduleDate:
        defaultDate ?? RemoveTimeStampFromDate(new Date(Date.now())),
      packageCategory: packageCategory,
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
          className={cn(
            " font-semibold text-lg bg-white border rounded-full text-black px-4 mt-4 ",
            {
              hidden: type,
            },
          )}
        >
          <div>{format(date ?? Date.now(), "iii dd/MM/yyyy")}</div>
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
            <div
              className={cn({
                hidden: isPackageStatusSunSet({
                  packageStatus: packageCategory,
                }),
              })}
            >
              <ColorRepresentationInfo
                className={cn("bg-green-500 ")}
                title="Available"
              />
            </div>
            <div
              className={cn("hidden", {
                block: isPackageStatusSunSet({
                  packageStatus: packageCategory,
                }),
              })}
            >
              <ColorRepresentationInfo
                className={cn("bg-green-500 ")}
                title="Available"
              />
            </div>
            <div>
              <ColorRepresentationInfo
                className="bg-red-500"
                title="Blocked / Full"
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
              containerClass="max-w-[200px] gap-1 text-blue-600"
              className={cn(
                "bg-white border mt-1 self-start  flex-shrink-0 border-black rounded-sm",
              )}
              title="Rest of the days requires 25 guests to book"
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
