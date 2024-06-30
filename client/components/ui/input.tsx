import * as React from 'react';

import { cn } from '@/lib/utils';
import tw from 'tailwind-styled-components';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const StyledInput = tw(Input)`
  h-12
  border
  border-gray-400
  bg-transparent
  focus:border-violet-600/50
  focus:outline-none
  focus:ring-2
  focus:ring-violet-600/20
`;

export { StyledInput as Input };
