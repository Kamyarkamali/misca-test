"use client";

import clsx from "clsx";
import { ButtonProps } from "../types/interfaces";

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "relative transition-transform duration-150 ease-out active:scale-95",
        "bg-brand-500 hover:bg-brand-600 text-white rounded-md",
        "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
      {loading && (
        <span className="absolute inset-0 bg-purple-500 bg-opacity-20 animate-pulse rounded-md"></span>
      )}
    </button>
  );
};

export default Button;
