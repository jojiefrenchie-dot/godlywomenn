"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        setError("Server error. Please try again later.");
        setIsLoading(false);
        return;
      }

      console.log('[REGISTER] Response status:', response.status);
      console.log('[REGISTER] Response data:', data);

      if (!response.ok) {
        // Better error message extraction
        let errorMsg = 'Registration failed. Please try again.';
        if (data.detail) {
          errorMsg = data.detail;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        } else if (typeof data === 'object') {
          // Handle field-specific errors
          const firstError = Object.values(data)[0];
          if (typeof firstError === 'string') {
            errorMsg = firstError;
          } else if (Array.isArray(firstError) && firstError.length > 0) {
            errorMsg = firstError[0];
          }
        }
        console.error('[REGISTER] Error:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      console.log('[REGISTER] Account created successfully, attempting auto sign-in...');

      // Wait a bit for the database to fully commit before attempting sign-in
      // This prevents "Invalid credentials" errors due to race conditions
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log('[REGISTER] Sign-in result:', signInResult);

      if (signInResult?.error) {
        console.log('[REGISTER] Auto sign-in failed:', signInResult.error, 'redirecting to login');
        setError("Account created successfully! Please sign in with your credentials.");
        setIsLoading(false);
        // Give user 2 seconds to read the message, then redirect
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (signInResult?.ok) {
        console.log('[REGISTER] Sign-in successful, redirecting to dashboard');
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        setError(error.message || "An error occurred. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#fdebd0]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-serif text-center text-gray-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join our community of faithful women
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <Input
              label="Full Name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Doe"
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="hello@example.com"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
            />

            {error && (
              <div className="text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}