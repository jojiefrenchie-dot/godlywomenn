'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';

export function Navigation() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#dc143c]">
          Godly Women
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/articles" className="hover:text-[#dc143c] transition">
            Articles
          </Link>
          <Link href="/marketplace" className="hover:text-[#dc143c] transition">
            Marketplace
          </Link>
          <Link href="/prayers" className="hover:text-[#dc143c] transition">
            Prayers
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.first_name}</span>
              <button
                onClick={handleLogout}
                className="bg-[#dc143c] text-white px-4 py-2 rounded hover:bg-[#b50930]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link
                href="/auth/login"
                className="text-[#dc143c] hover:underline"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-[#dc143c] text-white px-4 py-2 rounded hover:bg-[#b50930]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden bg-[#dc143c] text-white px-4 py-2 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-100 py-4 px-4 space-y-2">
          <Link href="/articles" className="block hover:text-[#dc143c]">
            Articles
          </Link>
          <Link href="/marketplace" className="block hover:text-[#dc143c]">
            Marketplace
          </Link>
          <Link href="/prayers" className="block hover:text-[#dc143c]">
            Prayers
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left text-[#dc143c] hover:underline"
            >
              Logout
            </button>
          ) : (
            <div className="space-y-2">
              <Link href="/auth/login" className="block text-[#dc143c]">
                Login
              </Link>
              <Link href="/auth/register" className="block bg-[#dc143c] text-white px-4 py-2 rounded text-center">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
