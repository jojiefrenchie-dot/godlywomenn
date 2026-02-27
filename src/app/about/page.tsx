'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#dc143c] to-[#f75270] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif mb-4">About Godly Women in Business</h1>
          <p className="text-lg">Empowering women to excel professionally while maintaining spiritual integrity</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Godly Women in Business exists to create a thriving community where women can pursue professional excellence without compromising their faith. We believe that biblical principles and business acumen are not mutually exclusive—they complement and strengthen one another.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to inspire, equip, and empower women to lead with integrity, make ethical business decisions, and create positive impact in their industries and communities.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            A world where women in business are recognized not only for their professional achievements but also for their character, compassion, and commitment to godly principles. We envision communities transformed by women who lead with faith, wisdom, and generosity.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Our Values</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#dc143c] mb-2">Faith</h3>
              <p className="text-gray-700">We place our trust in God and make decisions rooted in biblical principles.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#dc143c] mb-2">Integrity</h3>
              <p className="text-gray-700">We uphold the highest standards of honesty, transparency, and ethical conduct in all dealings.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#dc143c] mb-2">Excellence</h3>
              <p className="text-gray-700">We strive for excellence in our professional endeavors and personal development.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#dc143c] mb-2">Community</h3>
              <p className="text-gray-700">We believe in lifting as we climb, supporting and mentoring other women to reach their potential.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#dc143c] mb-2">Impact</h3>
              <p className="text-gray-700">We measure success not just by financial gain, but by the positive difference we make in the world.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">What We Offer</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-[#dc143c] font-bold">•</span>
              <span><strong>Inspiring Stories:</strong> Read about godly women throughout history and today who are making a difference.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#dc143c] font-bold">•</span>
              <span><strong>Marketplace:</strong> Buy and sell products and services from and to our community members.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#dc143c] font-bold">•</span>
              <span><strong>Prayer Community:</strong> Share prayer requests and intercede for one another.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#dc143c] font-bold">•</span>
              <span><strong>Mentorship & Networking:</strong> Connect with like-minded women and find mentors in your field.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#dc143c] font-bold">•</span>
              <span><strong>Direct Messaging:</strong> Communicate directly with community members to build relationships.</span>
            </li>
          </ul>
        </section>

        <section className="bg-[#fdebd0] p-8 rounded-lg">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-6">
            Whether you're starting your entrepreneurial journey, climbing the corporate ladder, or already leading in your field, there's a place for you here. Join women who are committed to excellence, faith, and making a meaningful impact.
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center px-6 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#b01031] transition-colors"
          >
            Get Started Today
          </Link>
        </section>
      </div>
    </div>
  );
}
