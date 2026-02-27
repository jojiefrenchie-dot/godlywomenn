'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Please enter an email address');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // For now, just show success
      console.log('Newsletter signup:', email);
      setSubmitted(true);
      setEmail('');
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#dc143c] to-[#f75270] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif mb-4">Stay Connected</h1>
          <p className="text-lg">Join our newsletter and never miss an update from our community</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Get the latest articles, success stories, marketplace updates, and community news delivered straight to your inbox. 
            Be the first to hear about new features, mentorship opportunities, and inspiring testimonies from godly women in business.
          </p>

          <div className="bg-[#fdebd0] p-8 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">What You'll Receive:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-[#dc143c]">✓</span>
                <span>Weekly articles from our community</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#dc143c]">✓</span>
                <span>Inspiring success stories and testimonies</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#dc143c]">✓</span>
                <span>Updates on marketplace and special offers</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#dc143c]">✓</span>
                <span>Community announcements and events</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#dc143c]">✓</span>
                <span>Exclusive member resources and tips</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {submitted && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✓ Thank you for subscribing! Check your email for confirmation.
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dc143c] focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#b01031] disabled:opacity-50 font-medium transition-colors whitespace-nowrap"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>

          <div className="border-t pt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Not a member yet?</h3>
            <p className="text-gray-700 mb-4">
              Join our community to connect with thousands of godly women in business, share your stories, and grow together.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#b01031] transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
