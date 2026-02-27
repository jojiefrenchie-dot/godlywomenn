"use client";

import { forwardRef, useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showToggle = true, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={[
              "w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-[#dc143c] focus:border-transparent",
              "transition-colors duration-200",
              showToggle ? "pr-14" : "",
              error ? "border-red-500" : "",
              className,
            ].join(" ")}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-r-lg focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                // Eye off icon - closed/hidden
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.226 4.338 5.557 7.5 10.734 7.5.882 0 1.74-.1 2.51-.284l-1.42-1.42c-.51.179-1.08.284-1.68.284-5.592 0-10.373-3.997-11.441-9.281l1.41-1.42zm12.727 9.9l-1.414-1.414L12 13.586l-3.293-3.293-1.414 1.414L10.586 15 7.293 18.293l1.414 1.414L12 16.414l3.293 3.293 1.414-1.414L13.414 15l3.293-3.293zm3.882-5.095c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7 1.73-4.39 6-7.5 11-7.5 4.478 0 8.268 2.943 9.542 7zM12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              ) : (
                // Eye icon - open/visible
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
