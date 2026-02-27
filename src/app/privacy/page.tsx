'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#dc143c] to-[#f75270] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-lg">Last updated: December 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-sm max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Godly Women in Business ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">2. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">We may collect information about you in a variety of ways, including:</p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-700">Name, email address, phone number, mailing address, profile information, and payment details.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
              <p className="text-gray-700">Information about how you interact with our platform, including pages visited, time spent, searches performed, and links clicked.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Device Information</h3>
              <p className="text-gray-700">Browser type, IP address, operating system, and other technical information.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect for various purposes:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To provide and maintain our services</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To process transactions and send related information</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To send promotional communications (with your consent)</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To improve and optimize our platform</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To monitor and analyze usage patterns</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To detect, prevent, and address fraud and security issues</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">5. Sharing Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> With service providers who assist us in operating our website and conducting our business</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> When required by law or to enforce our agreements</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> With your explicit consent</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> To protect the rights, privacy, safety, or property of our company and our users</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> Access the personal information we hold about you</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> Correct inaccurate information</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> Request deletion of your account and associated data</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> Opt-out of marketing communications</li>
            <li className="flex gap-3"><span className="text-[#dc143c]">•</span> Request a copy of your data in a portable format</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">7. Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            Our website uses cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences, though some features may not function properly if cookies are disabled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">8. Third-Party Links</h2>
          <p className="text-gray-700 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">9. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete such information and terminate the child's account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">10. Policy Updates</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the platform constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="bg-[#fdebd0] p-8 rounded-lg">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">11. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <p className="text-gray-700">
            Email: <a href="mailto:privacy@godlywomen.com" className="text-[#dc143c] hover:underline">privacy@godlywomen.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
