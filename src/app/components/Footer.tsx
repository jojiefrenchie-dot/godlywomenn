"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#f0f0f0] mt-auto bg-white">
      <div suppressHydrationWarning={true} className="container py-12">
        <div suppressHydrationWarning={true} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div suppressHydrationWarning={true} className="md:col-span-2">
            <div suppressHydrationWarning={true} className="flex items-center gap-3 mb-4">
              <div suppressHydrationWarning={true} className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f75270] to-[#f7cac9] flex items-center justify-center text-white font-semibold">G</div>
              <div>
                <div className="font-semibold text-[#333333]">GodlyWomen</div>
                <div className="text-[#666666]">Preserving inspiring stories.</div>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed">
              Celebrating and preserving the stories of faithful women throughout history.
              Join us in discovering lives that shaped communities and inspired generations.
            </p>
          </div>

          <div suppressHydrationWarning>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <div suppressHydrationWarning className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-[var(--muted)] hover:text-[var(--foreground)]">Home</Link>
              <Link href="/profiles" className="text-[var(--muted)] hover:text-[var(--foreground)]">Profiles</Link>
              <Link href="/articles" className="text-[var(--muted)] hover:text-[var(--foreground)]">Articles</Link>
              <Link href="/prayers" className="text-[var(--muted)] hover:text-[var(--foreground)]">Prayer</Link>
              <Link href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)]">About</Link>
            </div>
          </div>

          <div suppressHydrationWarning>
            <h3 className="font-semibold mb-4 text-[var(--foreground)]">Connect</h3>
            <div suppressHydrationWarning className="flex flex-col gap-2 text-sm">
              <Link href="/contact" className="text-[var(--muted)] hover:text-[var(--primary)]">Contact</Link>
              <Link href="/newsletter" className="text-[var(--muted)] hover:text-[var(--primary)]">Newsletter</Link>
              <Link href="/support" className="text-[var(--muted)] hover:text-[var(--primary)]">Support</Link>
              <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--primary)]">Privacy</Link>
            </div>
          </div>
        </div>

        <div suppressHydrationWarning className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row justify-between gap-4 text-sm text-[var(--muted)]">
          <div suppressHydrationWarning>© {new Date().getFullYear()} GodlyWomen. All rights reserved.</div>
          <div suppressHydrationWarning className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--primary)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--primary)]">Terms</Link>
            <Link href="/sitemap" className="hover:text-[var(--primary)]">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}