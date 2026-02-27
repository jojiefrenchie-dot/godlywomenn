"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/Button";
import { useAuth } from "@/lib/AuthContext";
import ClientOnly from "./ClientOnly";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <ClientOnly>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-[#f0f0f0] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/logo.png" alt="GodlyWomen" width={40} height={40} className="object-contain" />
              <span className="text-xl font-semibold text-gray-900">GodlyWomen</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {[
                ['Home', '/'],
                ['Profiles', '/profiles'],
                ['Articles', '/articles'],
                ['Marketplace', '/marketplace'],
                ['Prayer', '/prayers'],
                ['About', '/about'],
              ].map(([label, path]) => (
                <Link key={path} href={path} className="text-gray-600 hover:text-[#dc143c]">
                  {label}
                </Link>
              ))}
              {user && (
                <Link href="/dashboard/chats" className="text-gray-600 hover:text-[#dc143c]">
                  My Chats
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="h-10 px-4 py-0">
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="h-10 px-4 py-0 bg-white border rounded text-gray-700"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="h-10 px-4 py-0">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" className="h-10 px-4 py-0">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 -mr-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </nav>

            <div className={`md:hidden overflow-hidden transition-all duration-200 ${isMenuOpen ? 'max-h-[360px]' : 'max-h-0'}`}>
            <div className="py-4 space-y-4 border-t border-[#f0f0f0]">
              {[
                ['Home', '/'],
                ['Profiles', '/profiles'],
                ['Articles', '/articles'],
                ['Prayer', '/prayers'],
                ['About', '/about'],
              ].map(([label, path]) => (
                <Link key={path} href={path} className="block text-gray-600 hover:text-[#dc143c]">
                  {label}
                </Link>
              ))}
              {user && (
                <Link href="/dashboard/chats" className="block text-gray-600 hover:text-[#dc143c]">
                  My Chats
                </Link>
              )}
              
              <div className="pt-4 mt-4 space-y-3 border-t border-[#f0f0f0]">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" fullWidth>
                        Dashboard
                      </Button>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border rounded"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" fullWidth>
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" fullWidth>
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </ClientOnly>
  );
}