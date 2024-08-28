"use client";

import { cn, RemoveTimeStampFromDate } from "@/lib/utils";
import { InputLabel } from "../cnWrapper/InputLabel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onlineBookingFormValidator,
  TOnlineBookingFormValidator,
} from "@/lib/validators/onlineBookingValidator";
import { TGetPackageById } from "@/db/data/dto/package";
import { Button } from "../ui/button";
import BookingFormDatePicker from "../calender/BookingFormDatePicker";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { trpc } from "@/app/_trpc/client";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import Script from "next/script";
import toast from "react-hot-toast";
import { Orders } from "razorpay/dist/types/orders";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import Razorpay from "razorpay";
import { phoneNumberParser } from "@/lib/helpers/CommonBuisnessHelpers";

interface IBookingFormCard {
  className?: string;
  formData?: TGetPackageById;
  selectedSchedule?: {
    scheduleId?: string | null;
    scheduleStatus?: $Enums.SCHEDULE_STATUS | null;
  };
  selectedDate: Date;
  packageId: string;
  packagePrice: {
    child: number
    adult: number
  }}

const BookingFormCard = ({
  className,
  formData,
  selectedSchedule,
  packageId,
  selectedDate,
  packagePrice
}: IBookingFormCard) => {

  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    getValues,
  } = useForm<TOnlineBookingFormValidator>({
    resolver: zodResolver(onlineBookingFormValidator),
    defaultValues: {
      numOfChildren: 0,
      numOfBaby: 0,
      packageId: packageId,
      scheduleId: selectedSchedule?.scheduleId ?? "",
      selectedScheduleDate: RemoveTimeStampFromDate(selectedDate),
    },
  });

  const { mutate: CreateRazorPayIntent } =
    trpc.user.createRazorPayIntent.useMutation({
      onMutate() {
        toast.loading("creating razorpay intend");
      },

      async onSuccess(res) {
        
        toast.dismiss();
        const options = {
          key: process.env.RAZORPAY_KEYID,
          name: "Developer Testing",
          currency: "INR",
          amount:  res?.order.amount,
          order_id: res?.order.id,
          prefill: {
            name: "test",
            phone: phoneNumberParser(getValues("phone"))
          },
        }

        const paymentModal = new window.Razorpay(options)
        paymentModal.open();

        console.log(options.prefill.phone)

        paymentModal.on("success", function (data: any) {
          console.log(data)
          alert("Payment failed. Please try again.");
          toast.error("payment failed")
        });

        toast.success("intend created successfully");
        
      },
      onError() {
        toast.error("something went wrong");
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          `bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),
      0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full rounded-lg min-w-[400px] py-5 px-5`,
          className,
        )}
      >
        {/* {formData?.adultPrice}
      {formData?.childPrice} */}
        <h3 className=" text-2xl font-bold ">Book Now</h3>
        <hr className="bg-gray-200  border-0 w-full h-px my-2 font-"></hr>
        {/* <BookingFormDatePicker /> */}
        <InputLabel
          InputProps={{
            placeholder: "Name",
            ...register("name"),
            className:
              "border-0 placeholder:font-semibold placeholder:text-gray-500",
          }}
          errorMessage={errors.name ? `${errors.name.message}` : null}
        />

        <InputLabel
          InputProps={{
            placeholder: "Email",
            ...register("email"),
            className:
              "border-0 placeholder:font-semibold placeholder:text-gray-500",
          }}
          errorMessage={errors.email ? `${errors.email.message}` : null}
        />
        <InputLabel
          InputProps={{
            placeholder: "Phone",
            ...register("phone"),
            type: "number",
            className:
              "border-0 placeholder:font-semibold placeholder:text-gray-500",
          }}
          errorMessage={errors.phone ? `${errors.phone.message}` : null}
        />

        <InputLabel
          InputProps={{
            min: 0,
            placeholder: "Adult (10+ years)",
            ...register("numOfAdults", { valueAsNumber: true }),
            className:
              "border-0 placeholder:font-semibold placeholder:text-gray-500",
            type: "number",
          }}
          errorMessage={
            errors.numOfAdults ? `${errors.numOfAdults.message}` : null
          }
        />
        <InputLabel
          InputProps={{
            min: 0,
            placeholder: "Children (3-10 years)",
            ...register("numOfChildren", { valueAsNumber: true }),
            className:
              "border-0 placeholder:font-semibold placeholder:text-gray-500",
            type: "number",
          }}
          errorMessage={
            errors.numOfChildren ? `${errors.numOfChildren.message}` : null
          }
        />
        <InputLabel
          InputProps={{
            min: 0,
            placeholder: "Below (3 years)",
            ...register("numOfBaby", { valueAsNumber: true }),
            className:
              "border-0 placeholder:font-semibold placeholder:text-gray-500",
            type: "number",
          }}
          errorMessage={errors.numOfBaby ? `${errors.numOfBaby.message}` : null}
        />
        <p className="font-bold ml-2 text-gray-500 my-5 text-right">
          Total Price: <span className="text-black">$720</span>
        </p>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </>
  );
};

export default BookingFormCard;
