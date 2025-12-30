"use client";

import Link from "next/link";

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main suppressHydrationWarning className="min-h-screen bg-white">
      <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav suppressHydrationWarning className="py-6 flex items-center gap-4 text-sm font-medium text-gray-600">
          <Link 
            href="/" 
            className="hover:text-[#dc143c] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-[#dc143c]">Articles</span>
        </nav>
        {children}
      </div>
    </main>
  );
}