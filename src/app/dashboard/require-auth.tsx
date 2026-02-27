'use client';

import { useAuth } from "@/lib/AuthContext";
import { redirect } from "next/navigation";

export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  
  if (!isLoading && !user) {
    redirect(`/login`);
  }
  
  return { user, isLoading };
}
