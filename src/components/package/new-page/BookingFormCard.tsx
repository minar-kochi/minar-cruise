import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { Minus, Plus, PlusIcon } from "lucide-react";
import React from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
type TBookingFormCard = {
  register: UseFormRegister<TOnlineBookingFormValidator>;
  getValues: UseFormGetValues<TOnlineBookingFormValidator>;
  setValues: UseFormSetValue<TOnlineBookingFormValidator>;
  watch: UseFormWatch<TOnlineBookingFormValidator>;
  errors: FieldErrors<TOnlineBookingFormValidator>;
};
export default function BookingFormCard({
  register,
  getValues,
  setValues,
  watch,
  errors,
}: TBookingFormCard) {
  //   watch("numOfAdults");
  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className="w-full max-w-sm">
        <InputLabel
          errorClassName="justify-start ml-1"
          label="Name"
          labelClassName="font-medium"
          InputProps={{
            placeholder: "Name",
            ...register("name"),
            className:
              " placeholder:font-semibold w-full  placeholder:text-gray-500",
          }}
          containerClassName="w-full "
          errorMessage={errors.name ? `${errors.name.message}` : null}
        />
      </div>
      <div className="w-full max-w-sm">
        <InputLabel
          errorClassName="justify-start ml-1"
          label="Email"
          labelClassName="font-medium"
          InputProps={{
            placeholder: "jhon@example.com",
            ...register("email"),
            className:
              " placeholder:font-semibold w-full  placeholder:text-gray-500",
          }}
          containerClassName="w-full "
          errorMessage={errors.email ? `${errors.email.message}` : null}
        />
      </div>
      <div className="w-full max-w-sm">
        <InputLabel
          errorClassName="justify-start ml-1"
          label="Contact"
          labelClassName="font-medium"
          InputProps={{
            placeholder: "+91 9090909090",
            ...register("phone"),
            className:
              " placeholder:font-semibold w-full  placeholder:text-gray-500",
          }}
          containerClassName="w-full py-0 my-0 "
          errorMessage={errors.phone ? `${errors.phone.message}` : null}
        />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div>
            <Label className="mx-1.5" htmlFor="numOfAdults-count">
              Adult
            </Label>
            <div className="max-w-[150px] bg-slate-800 rounded-full p-2 w-full  flex items-center justify-center">
              <button
                // size={"icon"}
                className=" left-0 flex items-center justify-center  bg-slate-800 text-white hover:bg-primary p-2 w-8 h-8 aspect-square rounded-full"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfAdults");
                  if (Currvalue <= 0) {
                    return;
                  }
                  setValues("numOfAdults", Currvalue - 1);
                }}
              >
                <Minus />
              </button>

              <input
                className="max-w-[40px] p-1 bg-gray-800 rounded-full text-white  text-center"
                id="numOfAdults-count"
                {...register("numOfAdults", {
                  valueAsNumber: true,
                })}
              />
              <button
                className=" right-0 flex items-center justify-center  bg-slate-800 text-white hover:bg-green-600 p-2 w-8 h-8 aspect-square rounded-full"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfAdults");
                  if (Currvalue >= MAX_BOAT_SEAT) {
                    return;
                  }
                  setValues("numOfAdults", Currvalue + 1);
                }}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="numOfChildren-count" className="mx-1.5">
              Child
            </Label>
            <div className="max-w-[150px] bg-slate-800 rounded-full p-2 w-full  flex items-center justify-center">
              <button
                // size={"icon"}
                className=" left-0 flex items-center justify-center  bg-slate-800 text-white hover:bg-primary p-2 w-8 h-8 aspect-square rounded-full"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfChildren");
                  if (Currvalue <= 0) {
                    return;
                  }
                  setValues("numOfChildren", Currvalue - 1);
                }}
              >
                <Minus />
              </button>

              <input
                className="max-w-[40px] p-1 bg-gray-800 rounded-full text-white  text-center"
                id="numOfChildren-count"
                {...register("numOfChildren", {
                  valueAsNumber: true,
                })}
              />
              <button
                className=" right-0 flex items-center justify-center  bg-slate-800 text-white hover:bg-green-600 p-2 w-8 h-8 aspect-square rounded-full"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfChildren");
                  if (Currvalue >= MAX_BOAT_SEAT) {
                    return;
                  }
                  setValues("numOfChildren", Currvalue + 1);
                }}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="numOfBaby-count" className="mx-1.5">
              Infants
            </Label>
            <div className="max-w-[150px] bg-slate-800 rounded-full p-2 w-full  flex items-center justify-center">
              <button
                // size={"icon"}
                className=" left-0 flex items-center justify-center  bg-slate-800 text-white hover:bg-primary p-2 w-8 h-8 aspect-square rounded-full"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfBaby");
                  if (Currvalue <= 0) {
                    return;
                  }
                  setValues("numOfBaby", Currvalue - 1);
                }}
              >
                <Minus />
              </button>

              <input
                className="max-w-[40px] p-1 bg-gray-800 rounded-full text-white  text-center"
                id="numOfBaby-count"
                {...register("numOfBaby", {
                  valueAsNumber: true,
                })}
              />
              <button
                className=" right-0 flex items-center justify-center  bg-slate-800 text-white hover:bg-green-600 p-2 w-8 h-8 aspect-square rounded-full"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfBaby");
                  if (Currvalue >= MAX_BOAT_SEAT) {
                    return;
                  }
                  setValues("numOfBaby", Currvalue + 1);
                }}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>
        <p className="flex flex-col justify-start self-start ml-1 text-red-600">
          <span>
            {errors.numOfAdults ? `${errors.numOfAdults.message}` : null}
          </span>
          <span>
            {errors.numOfChildren ? `${errors.numOfChildren.message}` : null}
          </span>
          <span>{errors.numOfBaby ? `${errors.numOfBaby.message}` : null}</span>
        </p>
        <div className="flex pt-4 pb-2">
          <Checkbox id="terms-and-privacy-policy" required aria-required />
          <Label htmlFor="terms-and-privacy-policy" className="ml-2">
            Yes, I agree with the privacy policy and terms and conditions.
          </Label>
        </div>
      </div>
    </div>
  );
}
