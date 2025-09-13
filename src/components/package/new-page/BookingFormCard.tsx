import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { cn } from "@/lib/utils";
import { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import React from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import MonsoonCheckBox from "./monsoon-check-box";
type TBookingFormCard = {
  adultPrice: number;
  childPrice: number;
  register: UseFormRegister<TOnlineBookingFormValidator>;
  getValues: UseFormGetValues<TOnlineBookingFormValidator>;
  setValues: UseFormSetValue<TOnlineBookingFormValidator>;
  watch: UseFormWatch<TOnlineBookingFormValidator>;
  errors: FieldErrors<TOnlineBookingFormValidator>;
  className?: string;
};
export default function BookingFormCard({
  register,
  getValues,
  setValues,
  watch,
  errors,
  className,
  adultPrice,
  childPrice,
}: TBookingFormCard) {
  return (
    <div
      className={cn(
        "w-full flex items-center text-base font-normal justify-center flex-col ",
        className,
      )}
    >
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
      <div className="w-[90%]  max-w-sm">
        <InputLabel
          label="Email"
          labelClassName="text-sm"
          errorClassName="justify-start ml-1"
          InputProps={{
            placeholder: "john@gmail.com",
            ...register("email"),
            className:
              " placeholder:font-medium w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
          }}
          containerClassName="w-full "
          errorMessage={errors.email ? `${errors.email.message}` : null}
        />
      </div>
      <div className="w-[90%]  max-w-sm">
        <InputLabel
          label="Phone Number"
          labelClassName="text-sm"
          errorClassName="justify-start ml-1"
          InputProps={{
            placeholder: "9399779908",
            ...register("phone"),
            className:
              " placeholder:font-medium w-full h-[80%]  placeholder:text-gray-500 bg-white border-[#B3B3B3]",
          }}
          containerClassName="w-full "
          errorMessage={errors.phone ? `${errors.phone.message}` : null}
        />

        <div className="flex flex-wrap items-center justify-start gap-5 lg:gap-10  mt-4">
          <div className="">
            <p className="text-[13px] font-light  mx-1.5 leading-none">10Y+</p>
            <div className="flex items-center">
              <div className="flex-shrink-0 leading-4">
                <Label
                  className="mx-1.5 text-xs font-semibold "
                  htmlFor="numOfAdults-count"
                >
                  ADULT
                </Label>
                <p className="text-[12px] font-bold mx-1.5">₹ {adultPrice}</p>
              </div>
              <div className="max-w-[80px] bg-slate-800  rounded-full  w-full flex items-center justify-center">
                <button
                  // size={"icon"}
                  className=" left-0 text-white hover:text-red-500 w-5 h-8 "
                  type="button"
                  onClick={() => {
                    let currValue = getValues("numOfAdults") || 0;
                    if (currValue <= 0) {
                      return;
                    }
                    setValues("numOfAdults", currValue - 1);
                  }}
                >
                  -
                </button>

                <input
                  className="max-w-[25px]  bg-gray-800 rounded-full  text-white  text-center"
                  id="numOfAdults-count"
                  {...register("numOfAdults", {
                    valueAsNumber: true,
                    setValueAs: (v) => (isNaN(Number(v)) ? 0 : Number(v)),
                  })}
                />
                <button
                  className=" right-0 text-white hover:text-green-500 w-5 h-8"
                  type="button"
                  onClick={() => {
                    let currValue = getValues("numOfAdults") || 0;
                    if (currValue >= MAX_BOAT_SEAT) {
                      return;
                    }
                    setValues("numOfAdults", currValue + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-light  mx-1.5 leading-none">0-3Y</p>
            <div className="flex items-center mr-8">
              <div className="leading-4">
                <Label
                  htmlFor="numOfBaby-count"
                  className="mx-1.5 text-xs font-semibold flex-shrink-0"
                >
                  INFANT
                </Label>
                <p className="text-[12px] font-bold mx-1.5">₹ 0</p>
              </div>
              <div className="max-w-[80px] bg-slate-800 rounded-full  w-full  flex items-center justify-center">
                <button
                  // size={"icon"}
                  className=" left-0 text-white hover:text-red-500 w-5 h-8 "
                  type="button"
                  onClick={() => {
                    let currValue = getValues("numOfBaby") || 0;
                    if (currValue <= 0) {
                      return;
                    }
                    setValues("numOfBaby", currValue - 1);
                  }}
                >
                  -
                </button>

                <input
                  className="max-w-[25px]  bg-gray-800 rounded-full text-white  text-center"
                  id="numOfBaby-count"
                  {...register("numOfBaby", {
                    valueAsNumber: true,
                  })}
                />
                <button
                  className=" right-0 text-white hover:text-green-500  w-5 h-8 "
                  type="button"
                  onClick={() => {
                    let currValue = getValues("numOfBaby") || 0;
                    if (currValue >= MAX_BOAT_SEAT) {
                      return;
                    }
                    setValues("numOfBaby", currValue + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[13px] font-light mt-4 mx-1.5 leading-none">
            3-10Y
          </p>
          <div className="flex items-center ">
            <div className="leading-4">
              <Label
                htmlFor="numOfChildren-count"
                className="mx-1.5 text-xs font-semibold"
              >
                CHILD
              </Label>
              <p className="text-[12px] font-bold mx-1.5">₹ {childPrice}</p>
            </div>
            <div className="max-w-[80px] bg-slate-800 rounded-full  ml-1  flex items-center justify-center">
              <button
                // size={"icon"}
                className=" left-0 text-white hover:text-red-500 w-5 h-8 "
                type="button"
                onClick={() => {
                  let currValue = getValues("numOfChildren") || 0;
                  if (currValue <= 0) {
                    return;
                  }
                  setValues("numOfChildren", currValue - 1);
                }}
              >
                -
              </button>

              <input
                className="max-w-[25px]  bg-gray-800 rounded-full text-white  text-center"
                id="numOfChildren-count"
                {...register("numOfChildren", {
                  valueAsNumber: true,
                })}
              />
              <button
                className=" right-0 text-white hover:text-green-500 w-5 h-8"
                type="button"
                onClick={() => {
                  let currValue = getValues("numOfChildren") || 0;
                  if (currValue >= MAX_BOAT_SEAT) {
                    return;
                  }
                  setValues("numOfChildren", currValue + 1);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="my-5 h-[1px] w-[95%] bg-gray-300" />

        <p className="flex flex-col justify-start self-start ml-1 text-red-600">
          <span>
            {errors.numOfAdults ? `${errors.numOfAdults.message}` : null}
          </span>
          <span>
            {errors.numOfChildren ? `${errors.numOfChildren.message}` : null}
          </span>
          <span>{errors.numOfBaby ? `${errors.numOfBaby.message}` : null}</span>
        </p>
        <div className="flex items-center pb-2">
          <Checkbox id="terms-and-privacy-policy" required aria-required />
          <Label
            htmlFor="terms-and-privacy-policy"
            className="ml-2 text-xs font-normal"
          >
            Yes, I agree with the privacy policy and terms and conditions.
          </Label>
        </div>
        {/* <MonsoonCheckBox/> */}
      </div>
    </div>
  );
}
