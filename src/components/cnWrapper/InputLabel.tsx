import React from "react";
import { Input, InputProps } from "../ui/input";
import { Textarea, TextareaProps } from "../ui/textarea";
import { cn } from "@/lib/utils";

export interface TInputLabel {
  InputBox?: "textarea";
  TextAreaProps?: TextareaProps;
  TextAreaClassName?: string;
  label?: string;
  InputProps?: InputProps;
  errorMessage?: string | null;
  containerClassName?: string;
}

const InputLabel = React.forwardRef<HTMLInputElement, TInputLabel>(
  (
    {
      TextAreaClassName,
      InputBox,
      label,
      errorMessage,
      TextAreaProps,
      InputProps,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-2 py-2", containerClassName)}>
        <label
          className={cn("pl-2 font-semibold ", {
            hidden: !label?.length,
          })}
        >
          {label}
        </label>
        {InputBox === "textarea" ? (
          <Textarea
            className={cn("", TextAreaClassName)}
            placeholder={label}
            {...TextAreaProps}
          />
        ) : (
          <Input ref={ref} {...InputProps} />
        )}
        <p className="text-red-500 flex justify-center">{errorMessage}</p>
      </div>
    );
  },
);

InputLabel.displayName = "InputLabel";

export { InputLabel };
