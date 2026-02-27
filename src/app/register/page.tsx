"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { PasswordInput } from "@/app/components/ui/PasswordInput";

export default function RegisterPage() {
  const router = useRouter();
  const { register, login } = useAuth();
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
      console.log('[REGISTER] Attempting to register:', email);
      
      // Register the user
      await register(name, email, password);
      
      console.log('[REGISTER] Account created successfully, attempting auto sign-in...');

      // Wait a bit for the database to fully commit before attempting sign-in
      await new Promise(resolve => setTimeout(resolve, 500));

      // Sign in the user after successful registration
      try {
        await login(email, password);
        console.log('[REGISTER] Auto sign-in successful, redirecting to dashboard');
        router.push("/dashboard");
      } catch (signInError) {
        console.log('[REGISTER] Auto sign-in failed:', signInError, 'redirecting to login');
        setError("Account created successfully! Please sign in with your credentials.");
        setIsLoading(false);
        // Give user 2 seconds to read the message, then redirect
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      console.error("[REGISTER] Registration error:", error);
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

            <PasswordInput
              label="Password"
              name="password"
              required
              placeholder="••••••••"
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              required
              placeholder="••••••••"
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
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