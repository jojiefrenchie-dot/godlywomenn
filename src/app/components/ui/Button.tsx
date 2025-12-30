"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || isLoading || pending;

  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const variantStyles = {
    primary: "bg-[#dc143c] text-white hover:bg-[#f75270] focus:ring-[#dc143c]",
    secondary: "bg-[#fdebd0] text-[#dc143c] hover:bg-[#f7cac9] focus:ring-[#f7cac9]",
    outline: "border-2 border-[#dc143c] text-[#dc143c] hover:bg-[#fdebd0] focus:ring-[#dc143c]"
  };

  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    widthStyles,
    isDisabled ? "opacity-50 cursor-not-allowed" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading || pending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}