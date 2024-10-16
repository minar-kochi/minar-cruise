"use client";

import { PopOverDatePicker } from "@/components/admin/dashboard/Schedule/PopOverScheduleDate";
import ScheduleDatePicker from "@/components/admin/dashboard/Schedule/ScheduleDatePicker";
import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  cn,
  filterDateFromCalender,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import {
  exclusivePackageValidator,
  TExclusivePackageValidator,
} from "@/lib/validators/exclusivePackageContactValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { setDate } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { date } from "zod";
import {} from "embla-carousel";
import { Button } from "@/components/ui/button";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import CalendarPopover from "./CalendarPopover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomModal from "@/components/custom/CustomModal";
import { Loader2 } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface IExclusivePackageEnquiryCard {
  type?: "modal" | undefined;
}
export default function ExclusivePackageEnquiryCard({
  type,
}: IExclusivePackageEnquiryCard) {
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<TExclusivePackageValidator>({
    defaultValues: {
      count: 25,
      selectedDate: RemoveTimeStampFromDate(new Date(Date.now())),
    },
    resolver: zodResolver(exclusivePackageValidator),
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { mutate: SendExclusiveEmail, isPending } =
    trpc.user.sendExclusiveBookingMessage.useMutation({
      onSuccess(data, variables, context) {
        setOpenModal(true);
      },
      onError(error, variables, context) {
        toast.error("Something went wrong");
      },
    });
  async function onSubmit(data: TExclusivePackageValidator) {
    try {
      const token =
        executeRecaptcha && (await executeRecaptcha("exclusiveEnquiry"));
      if (!token) {
        toast.error("Failed to load Recaptcha");
        return;
      }
      SendExclusiveEmail({ ...data, token });
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  return (
    <>
      <Dialog onOpenChange={setOpenModal} open={openModal}>
        <DialogContent className="">
          <DialogHeader className="sm:text-center ">
            <DialogTitle className=" font-bold pb-2">
              Enquiry Successful
            </DialogTitle>
            <DialogDescription className="text-md">
              Our representative will contact you soon !
            </DialogDescription>
            <DialogDescription className="text-md">
              Thank you for choosing Minar
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col pt-3  items-center justify-center pb-5 w-full "
      >
        <p
          className={cn("font-semibold text-lg py-1", {
            "text-xl font-bold pb-5": type === "modal",
          })}
        >
          Enquire Cruise
          <span className="text-red-500 "> Exclusively </span>
        </p>
        {type === "modal" ? (
          <CalendarPopover date={date}>
            <Calendar
              sizeMode="lg"
              selected={new Date(watch("selectedDate"))}
              onSelect={(date) => {
                if (!date) return;
                let Selected = RemoveTimeStampFromDate(date);
                setDate(date);
                setValue("selectedDate", Selected);
              }}
              disabled={{ before: new Date(Date.now()) }}
              mode="single"
            />
          </CalendarPopover>
        ) : (
          <Calendar
            sizeMode="lg"
            selected={new Date(watch("selectedDate"))}
            onSelect={(date) => {
              if (!date) return;
              let Selected = RemoveTimeStampFromDate(date);
              setDate(date);
              setValue("selectedDate", Selected);
            }}
            disabled={{ before: new Date(Date.now()) }}
            mode="single"
          />
        )}
        <div className="w-[90%]  max-w-sm ">
          <InputLabel
            errorClassName="justify-start ml-1"
            label="Name"
            labelClassName="text-sm"
            InputProps={{
              placeholder: "Your Name",
              ...register("name"),
              className:
                " placeholder:font-medium  w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
            }}
            containerClassName="w-full "
            errorMessage={errors.name ? `${errors.name.message}` : null}
          />
        </div>
        <div className="w-[90%]  max-w-sm ">
          <InputLabel
            errorClassName="justify-start ml-1"
            label="Email"
            labelClassName="text-sm"
            InputProps={{
              placeholder: "johndoe@example.com",
              ...register("email"),
              className:
                " placeholder:font-medium  w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
            }}
            containerClassName="w-full "
            errorMessage={errors.email ? `${errors.email.message}` : null}
          />
        </div>
        <div className="w-[90%]  max-w-sm ">
          <InputLabel
            errorClassName="justify-start ml-1"
            label="Contact"
            labelClassName="text-sm"
            InputProps={{
              placeholder: "+91090990909",
              ...register("phone"),
              className:
                " placeholder:font-medium  w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
            }}
            containerClassName="w-full "
            errorMessage={errors.phone ? `${errors.phone.message}` : null}
          />
        </div>

        <div className="w-[90%]  max-w-sm ">
          <InputLabel
            errorClassName="justify-start ml-1"
            label="Number of People"
            labelClassName="text-sm"
            InputProps={{
              placeholder: "max 150 Pax",
              ...register("count", {
                valueAsNumber: true,
              }),
              className:
                " placeholder:font-medium  w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
            }}
            containerClassName="w-full "
            errorMessage={errors.count ? `${errors.count.message}` : null}
          />
        </div>
        <div className="w-[90%]  max-w-sm ">
          <InputLabel
            errorClassName="justify-start ml-1"
            label="Number of Hours"
            labelClassName="text-sm"
            InputProps={{
              placeholder: "1 Hour, 2-3 Hours?",
              ...register("Duration"),
              className:
                " placeholder:font-medium  w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
            }}
            containerClassName="w-full "
            errorMessage={errors.Duration ? `${errors.Duration.message}` : null}
          />
        </div>
        <div className="w-[90%]  max-w-sm ">
          <InputLabel
            errorClassName="justify-start ml-1"
            label="Events"
            labelClassName="text-sm"
            InputProps={{
              placeholder: "Familiy, corporate, Party Etc...",
              ...register("eventType"),
              className:
                " placeholder:font-medium  w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
            }}
            containerClassName="w-full "
            errorMessage={
              errors.eventType ? `${errors.eventType.message}` : null
            }
          />
        </div>
        <Button
          disabled={isSubmitting || isPending}
          type="submit"
          className={cn("mt-2")}
        >
          {isPending ? (
            <div className="flex gap-2 items-center justify-center">
              <Loader2 className="animate-spin w-4 h-4" />
              loading{" "}
            </div>
          ) : (
            "Enquire Now"
          )}
        </Button>
      </form>
    </>
  );
}
