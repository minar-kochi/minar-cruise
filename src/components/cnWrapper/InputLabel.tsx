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
  labelClassName?: string;
  errorClassName?: string;
}

const InputLabel = React.forwardRef<HTMLInputElement, TInputLabel>(
  (
    {
      TextAreaClassName,
      InputBox,
      errorClassName,
      labelClassName,
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
      <div className={cn("my-1", containerClassName)}>
        <label
          className={cn("pl-2 font-semibold ", labelClassName, {
            hidden: !label,
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
        <p
          className={cn(
            "text-red-600 flex justify-center text-sm mt-0.5",
            errorClassName,
          )}
        >
          {errorMessage}
        </p>
      </div>
    );
  },
);

InputLabel.displayName = "InputLabel";

export { InputLabel };
