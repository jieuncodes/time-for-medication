import * as React from "react";

import { cn } from "@/lib/utils";
import tw from "tailwind-styled-components";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const StyledInput = tw(Input)`
  bg-transparent
  border
  border-gray-400
  rounded-xl
  h-12
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500/50
  focus:border-blue-500
`;

export { StyledInput as Input };
