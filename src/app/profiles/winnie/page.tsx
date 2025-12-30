'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WinnieAdomaProfile() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#dc143c] to-[#f75270] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center mb-12">
          {/* Profile Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#f7cac9] to-[#fdebd0] flex items-center justify-center mb-6 shadow-lg">
            <span className="text-6xl">👩‍💼</span>
          </div>
          
          <h1 className="text-4xl font-serif text-gray-900 mb-2 text-center">
            Winnie Adoma
          </h1>
          <p className="text-xl text-[#dc143c] font-medium mb-4">Founder</p>
          <p className="text-center text-gray-600 max-w-2xl">
            Visionary leader dedicated to empowering women in business and fostering spiritual growth across communities
          </p>
        </div>

        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">About Winnie</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Winnie Adoma stands as a beacon of hope and inspiration for women across Africa seeking to combine business acumen with spiritual conviction. With over 15 years of experience in business development, she has dedicated her life to empowering other women to reach their fullest potential in their professional callings.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Founding Mission</h3>
            <p>
              As the founder of Godly Women in Business, Winnie envisioned a community where women would not have to compromise their faith to succeed in the corporate world. Her mission is clear: create spaces where women can excel professionally while maintaining their spiritual integrity and deepening their relationship with God.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Leadership Philosophy</h3>
            <p>
              Winnie's leadership philosophy is rooted in the belief that true success is not measured by wealth alone, but by the positive impact we have on our communities and the legacy we leave for future generations. She believes that godly principles should guide all business decisions, from employee treatment to corporate responsibility.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Impact and Vision</h3>
            <p>
              Through Godly Women in Business, Winnie has directly mentored hundreds of women entrepreneurs, professionals, and business leaders. Her work has helped women establish successful businesses, secure leadership positions in major corporations, and become economic pillars in their communities. Yet she remains humble, crediting her success to God's guidance and the support of her community.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">A Living Testimony</h3>
            <p>
              Winnie's life is a testament to the power of faith combined with hard work, strategic thinking, and genuine compassion for others. She continues to inspire through her speaking engagements, mentorship programs, and her unwavering commitment to lifting other women as she climbs.
            </p>
          </div>
        </div>

        {/* Connect Section */}
        <div className="bg-[#fdebd0] p-8 rounded-lg mt-12">
          <h3 className="text-xl font-serif text-gray-900 mb-4">Learn More</h3>
          <p className="text-gray-700 mb-4">
            To learn more about Winnie's work and Godly Women in Business, explore our articles and community resources.
          </p>
          <Link 
            href="/articles/winnie-adoma-vision-leadership"
            className="inline-flex items-center px-6 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#f75270] transition-colors"
          >
            Read Full Story
          </Link>
        </div>
      </div>
    </div>
  );
}
