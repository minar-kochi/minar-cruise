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
    <div className="w-full flex items-center text-base font-normal justify-center flex-col ">
      
      <div className="w-[90%]  max-w-sm ">
        <InputLabel
          errorClassName="justify-start ml-1"
          label="Name"
          labelClassName=""
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
          labelClassName=""
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
          labelClassName=""
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

        <div className="flex flex-wrap items-center justify-start gap-10 md:mt-4">
          <div className="flex items-center">
            <div>
              <Label
                className="mx-1.5 text-xs font-semibold "
                htmlFor="numOfAdults-count"
              >
                ADULT
              </Label>
              <p className="text-[10px] mx-1.5">₹ 750</p>
            </div>
            <div className="max-w-[80px] bg-slate-800  rounded-full  w-full flex items-center justify-center">
              <button
                // size={"icon"}
                className=" left-0 text-white hover:text-red-500 w-4 h-8 "
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfAdults");
                  if (Currvalue <= 0) {
                    return;
                  }
                  setValues("numOfAdults", Currvalue - 1);
                }}
              >
                -
              </button>

              <input
                className="max-w-[20px]  bg-gray-800 rounded-full  text-white  text-center"
                id="numOfAdults-count"
                {...register("numOfAdults", {
                  valueAsNumber: true,
                })}
              />
              <button
                className=" right-0 text-white hover:text-green-500 w-4 h-8"
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfAdults");
                  if (Currvalue >= MAX_BOAT_SEAT) {
                    return;
                  }
                  setValues("numOfAdults", Currvalue + 1);
                }}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center mr-8">
            <div>
              <Label
                htmlFor="numOfBaby-count"
                className="mx-1.5 text-xs font-semibold"
              >
                INFANT
              </Label>
              <p className="text-[10px] mx-1.5">₹ 0</p>
            </div>
            <div className="max-w-[80px] bg-slate-800 rounded-full  w-full  flex items-center justify-center">
              <button
                // size={"icon"}
                className=" left-0 text-white hover:text-red-500 w-4 h-8 "
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfBaby");
                  if (Currvalue <= 0) {
                    return;
                  }
                  setValues("numOfBaby", Currvalue - 1);
                }}
              >
                -
              </button>

              <input
                className="max-w-[20px]  bg-gray-800 rounded-full text-white  text-center"
                id="numOfBaby-count"
                {...register("numOfBaby", {
                  valueAsNumber: true,
                })}
              />
              <button
                className=" right-0 text-white hover:text-green-500  w-4 h-8 "
                type="button"
                onClick={() => {
                  let Currvalue = getValues("numOfBaby");
                  if (Currvalue >= MAX_BOAT_SEAT) {
                    return;
                  }
                  setValues("numOfBaby", Currvalue + 1);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div>
            <Label
              htmlFor="numOfChildren-count"
              className="mx-1.5 text-xs font-semibold"
            >
              CHILD
            </Label>
            <p className="text-[10px] mx-1.5">₹ 400</p>
          </div>
          <div className="max-w-[80px] bg-slate-800 rounded-full  ml-1  flex items-center justify-center">
            <button
              // size={"icon"}
              className=" left-0 text-white hover:text-red-500 w-4 h-8 "
              type="button"
              onClick={() => {
                let Currvalue = getValues("numOfChildren");
                if (Currvalue <= 0) {
                  return;
                }
                setValues("numOfChildren", Currvalue - 1);
              }}
            >
              -
            </button>

            <input
              className="max-w-[20px]  bg-gray-800 rounded-full text-white  text-center"
              id="numOfChildren-count"
              {...register("numOfChildren", {
                valueAsNumber: true,
              })}
            />
            <button
              className=" right-0 text-white hover:text-green-500 w-4 h-8"
              type="button"
              onClick={() => {
                let Currvalue = getValues("numOfChildren");
                if (Currvalue >= MAX_BOAT_SEAT) {
                  return;
                }
                setValues("numOfChildren", Currvalue + 1);
              }}
            >
              +
            </button>
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
      </div>
    </div>
  );
}
