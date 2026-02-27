'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on "Get Started" on our homepage, fill in your details, and verify your email address. You\'ll be able to access all community features once your account is verified.',
    },
    {
      question: 'How do I post an article?',
      answer: 'Once logged in, navigate to Articles and click "Write an Article". Fill in your title, excerpt, content, and select a category. You can save as a draft or publish immediately.',
    },
    {
      question: 'Can I use the marketplace to sell my products?',
      answer: 'Yes! Go to the Marketplace section, click "List a Product", and follow the steps to add your products or services. You can set prices in multiple currencies.',
    },
    {
      question: 'How do I connect with other members?',
      answer: 'You can browse profiles, view featured women, and send direct messages to connect. Check out the Prayer section to pray with the community.',
    },
    {
      question: 'Is my information kept private?',
      answer: 'Yes, we take privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. See our Privacy Policy for details.',
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'If you encounter any inappropriate content or behavior, use the report button on that content or contact our support team directly.',
    },
    {
      question: 'Can I delete my account?',
      answer: 'Yes, you can request account deletion from your account settings. Your data will be permanently removed after a 30-day retention period.',
    },
    {
      question: 'How can I update my profile information?',
      answer: 'Go to your Dashboard, click on "Profile Settings", and update your name, bio, location, website, and social media links as desired.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#dc143c] to-[#f75270] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif mb-4">Support & Help</h1>
          <p className="text-lg">Find answers to common questions or get in touch with our team</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/contact" className="p-6 border border-gray-200 rounded-lg hover:border-[#dc143c] hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-600">Have a question? Send us a message and we'll respond quickly.</p>
          </Link>
          <Link href="/newsletter" className="p-6 border border-gray-200 rounded-lg hover:border-[#dc143c] hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">📧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Newsletter</h3>
            <p className="text-gray-600">Subscribe for updates and tips delivered to your inbox.</p>
          </Link>
        </div>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
                >
                  {faq.question}
                  <span className={`text-[#dc143c] transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <div className="mt-12 p-8 bg-[#fdebd0] rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-700 mb-6">
            If you couldn't find the answer you're looking for, our support team is here to help.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#b01031] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
