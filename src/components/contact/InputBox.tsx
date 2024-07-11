import { cn } from "@/lib/utils";
import React, { ElementType, InputHTMLAttributes } from "react";

type InputProps = {
  as?: "input" | "textarea";
  label: string;
  placeholder?: string;
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>
};

const InputBox = React.forwardRef<HTMLDivElement, InputProps>(
  (
    { as: Comp = "input", label, placeholder, className, ...restProps },
    ref
  ) => {
    return (
      <>
        <div ref={ref} className={cn("flex flex-col gap-3 py-5")}>
          <label htmlFor="" className="text-slate-500 text-sm">
            {label}
          </label>
          <Comp
            type="text"
            className={cn(
              "w-full h-10 bg-gray-200 hover:bg-gray-300",
              className
            )}
            placeholder={placeholder}
            {...restProps}
          />
        </div>
      </>
    );
  }
);

InputBox.displayName = "InputBox";
export default InputBox;
