"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send reset instructions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#fdebd0]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-serif text-center text-gray-900 mb-2">
          Reset Your Password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {success
            ? "Check your email for reset instructions"
            : "Enter your email to receive reset instructions"}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                If an account exists with that email, you will receive password
                reset instructions shortly.
              </p>
              <Link
                href="/login"
                className="text-[#dc143c] hover:text-[#f75270] transition-colors duration-200"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="hello@example.com"
              />

              {error && (
                <div className="text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              <div>
                <Button type="submit" fullWidth isLoading={isLoading}>
                  Send Reset Instructions
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-[#dc143c] hover:text-[#f75270] transition-colors duration-200"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}