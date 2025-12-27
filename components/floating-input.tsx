import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type FloatingInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          placeholder=" "
          className={cn("peer h-12 pt-6", className)}
          {...props}
        />

        <label
          className="
          absolute right-3
          top-1/2 -translate-y-1/2
          text-gray-400 text-base
          bg-background px-1
          transition-all duration-200
          pointer-events-none

          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:text-blue-500
          peer-focus:-translate-y-0

          peer-not-placeholder-shown:top-2
          peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:text-blue-500
          peer-not-placeholder-shown:-translate-y-0
        "
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
