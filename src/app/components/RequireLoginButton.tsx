"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default function RequireLoginButton({ href, className = "", children }: Props) {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const resp = await fetch('/api/auth/session');
      if (resp.ok) {
        const data = await resp.json();
        // If session object appears valid, navigate to target
        if (data && (data.user || data.accessToken || Object.keys(data).length > 0)) {
          router.push(href);
          return;
        }
      }
    } catch (err) {
      // ignore errors and fall through to redirect to login
    }

    // Not authenticated — send to login with callback
    const cb = encodeURIComponent(href);
    window.location.href = `/login?callbackUrl=${cb}`;
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
