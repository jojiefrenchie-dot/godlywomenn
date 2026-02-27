"use client";

import Link from "next/link";
import { profiles } from "../data";

export default function ProfilesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif mb-4 text-[#dc143c]">
          Inspiring Women of Faith
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the remarkable stories of women who have shaped communities and touched lives through their faith and dedication.
        </p>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.map((profile) => (
          <Link
            key={profile.slug}
            href={`/profiles/${profile.slug}`}
            className="group block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-[#dc143c] transition-colors">
                {profile.name}
              </h2>
              <p className="text-[#dc143c] font-medium">{profile.title}</p>
            </div>
            <p className="text-gray-600 line-clamp-3 mb-4">{profile.bio}</p>
            <div className="text-[#dc143c] font-medium group-hover:text-[#f75270] transition-colors flex items-center gap-2">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}