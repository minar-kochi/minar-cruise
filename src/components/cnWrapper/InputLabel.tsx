import React from "react";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";

export interface TInputLabel {
  errorMessage?: string | null;
  label?: string;
  InputProps?: InputProps;
  containerClassName?: string;
}

const   InputLabel = React.forwardRef<HTMLInputElement, TInputLabel>(
  ({ label, errorMessage, InputProps, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-2 py-2", containerClassName)}>
        <label
          className={cn("pl-2 font-semibold ", {
            hidden: !label?.length,
          })}
        >
          {label}
        </label>
        <Input ref={ref} {...InputProps} />
        <p className="text-red-500 flex justify-center">{errorMessage}</p>
      </div>
    );
  },
);

InputLabel.displayName = "InputLabel";

export { InputLabel };
