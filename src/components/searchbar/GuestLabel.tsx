import { Button } from "../ui/button";
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TSearchValidator } from "@/lib/validators/SearchFilterValidator";
import { SelectValue } from "@radix-ui/react-select";
import { useState } from "react";

interface IGuestInterface {
  label: string;
  desc: string;
  register: UseFormRegister<TSearchValidator>;
  type: keyof Pick<TSearchValidator, "adultCount" | "babyCount" | "childCount">;
  setValue: UseFormSetValue<TSearchValidator>;
  getValue: UseFormGetValues<TSearchValidator>;
  watch: UseFormWatch<TSearchValidator>;
}
function GuestLabel({
  label,
  desc,
  type,
  register,
  getValue,
  setValue,
  watch,
}: IGuestInterface) {
  // const [count, setCount] = useState(0);

  return (
    <section className="border-slate-300 mx-4 py-4">
      <article className="flex w-full">
        <div className="w-full space-y-1">
          <h4 className="font-semibold ">{label}</h4>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            onClick={() => {
              // console.log(first)
              setValue(
                type,
                (() => {
                  let x = getValue(type);
                  console.log(x);
                  return x + 1;
                })()
              );
            }}
            // onClick={() => {
            //   setCount(prev => prev+1)
            //   setValue(type, count);
            //   console.log(count)
            //   console.log(getValue())
            // }}
          >
            +
          </Button>
          <input
            className="max-w-[38px] text-center"
            minLength={1}
            maxLength={3}
            value={watch(type)}
          />
          <Button
            onClick={() => {
              setValue(
                type,
                (() => {
                  let x = getValue(type);
                  console.log(x);
                  return Math.max(0, x - 1);
                })()
              );
            }}
          >
            -
          </Button>
        </div>
      </article>
    </section>
  );
}

export default GuestLabel;
