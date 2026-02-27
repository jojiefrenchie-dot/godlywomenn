'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HellenOjwangProfile() {
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
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#dc143c] to-[#f75270] flex items-center justify-center mb-6 shadow-lg">
            <span className="text-6xl">👩‍💻</span>
          </div>
          
          <h1 className="text-4xl font-serif text-gray-900 mb-2 text-center">
            Hellen Ojwang
          </h1>
          <p className="text-xl text-[#dc143c] font-medium mb-4">Esteemed Member</p>
          <p className="text-center text-gray-600 max-w-2xl">
            An accomplished professional whose grace, wisdom, and service inspire many to pursue their calling with integrity
          </p>
        </div>

        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">About Hellen</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Hellen Ojwang embodies the perfect blend of professional excellence and genuine compassion. Her career journey has taken her through various industries, and in each role, she has distinguished herself not just through her competence, but through her character and integrity.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">The Art of Gracious Leadership</h3>
            <p>
              What sets Hellen apart is her unique ability to lead with grace. She believes that authority gained through grace is far more powerful than authority gained through fear. In every organization she has worked with, Hellen has been known for developing her team members, celebrating their successes, and helping them grow beyond their own expectations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Wisdom from Experience</h3>
            <p>
              Hellen's wisdom is not academic but hard-earned through years of navigating complex professional landscapes with faith as her compass. She has faced challenges that would have broken many, yet she emerged stronger, more faithful, and more committed to serving others. Her colleagues and mentees speak of her ability to see situations not just through a business lens, but through a lens of human dignity and God's purpose.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">A Servant's Heart</h3>
            <p>
              At her core, Hellen is a servant. Whether in the boardroom or at community events, her first instinct is to ask, "How can I help?" This servant's heart has won her respect and admiration across all circles. She mentors young professionals, volunteers in her community, and dedicates significant time to causes she believes in.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Inspiring Others to Excellence</h3>
            <p>
              Hellen's greatest joy comes from seeing others succeed. She has dedicated herself to creating opportunities for talented women and men to shine, believing that a rising tide lifts all boats. Her legacy will not be measured by titles held or money earned, but by the lives touched and futures brightened through her influence.
            </p>
          </div>
        </div>

        {/* Connect Section */}
        <div className="bg-[#fdebd0] p-8 rounded-lg mt-12">
          <h3 className="text-xl font-serif text-gray-900 mb-4">Learn More</h3>
          <p className="text-gray-700 mb-4">
            Discover more about Hellen's professional journey and contributions to our community.
          </p>
          <Link 
            href="/articles/hellen-ojwang-grace-wisdom"
            className="inline-flex items-center px-6 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#f75270] transition-colors"
          >
            Read Full Story
          </Link>
        </div>
      </div>
    </div>
  );
}
