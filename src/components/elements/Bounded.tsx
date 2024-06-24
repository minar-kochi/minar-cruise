import { cn } from "@/lib/utils";
import React from "react";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};
  
const Bounded = React.forwardRef<HTMLDivElement, BoundedProps>(
  ({ as: Comp = "section", className, children, ...restProps }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-screen-xl px-2.5 md:px-8 lg:px-10",
          className
        )}
        {...restProps}
      >
        {children}
      </Comp>
    );
  }
);

Bounded.displayName = "Bounded";
export default Bounded;
