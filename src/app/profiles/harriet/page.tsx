'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MadamHarrietProfile() {
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
            <span className="text-6xl">🌟</span>
          </div>
          
          <h1 className="text-4xl font-serif text-gray-900 mb-2 text-center">
            Madam Harriet
          </h1>
          <p className="text-xl text-[#dc143c] font-medium mb-4">Community Champion</p>
          <p className="text-center text-gray-600 max-w-2xl">
            A beacon of hope and encouragement whose generosity and faith have transformed countless lives
          </p>
        </div>

        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">About Madam Harriet</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Madam Harriet is known throughout her community as someone who brings hope wherever she goes. In a world full of challenges and setbacks, she refuses to lose sight of the good that can be done when faith guides our actions. Her unwavering belief in God's provision and care has been contagious, inspiring many to persevere through their own difficult seasons.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">The Power of Generosity</h3>
            <p>
              Harriet's generosity is legendary. Those who know her speak of her remarkable ability to give—not just of her resources, but of her time, attention, and genuine care. She has supported countless individuals through their darkest hours, offering not just material help but emotional and spiritual support. Her generosity flows from a deep well of gratitude for what God has blessed her with.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Transformed Lives</h3>
            <p>
              The stories of those whose lives have been touched by Madam Harriet are countless. From young women escaping difficult circumstances to families rebuilding after loss, her quiet interventions have changed trajectories. Yet she never seeks recognition or thanks. For Harriet, the reward is simply seeing others flourish and knowing that she has been part of God's work in their lives.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Servant Leadership in Action</h3>
            <p>
              Madam Harriet embodies servant leadership in its purest form. She believes that leadership is not about position or power, but about availability to serve. Whether through formal charitable work or informal mentorship, she shows up for people. Her life demonstrates that true strength is found in humility and true influence comes through genuine care.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">A Living Legacy</h3>
            <p>
              Though Madam Harriet would likely downplay the significance of her work, her legacy is undeniable. Generations of women have learned from her example what it means to live with faith, generosity, and purpose. She continues to be a living testimony that one person, armed with faith and a willing heart, can indeed transform their community.
            </p>
          </div>
        </div>

        {/* Connect Section */}
        <div className="bg-[#fdebd0] p-8 rounded-lg mt-12">
          <h3 className="text-xl font-serif text-gray-900 mb-4">Learn More</h3>
          <p className="text-gray-700 mb-4">
            Join our community to learn more about Madam Harriet's inspiring journey and her message of hope.
          </p>
          <Link 
            href="/articles/madam-harriet-hope-generosity"
            className="inline-flex items-center px-6 py-3 bg-[#dc143c] text-white rounded-lg hover:bg-[#f75270] transition-colors"
          >
            Read Full Story
          </Link>
        </div>
      </div>
    </div>
  );
}
