'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

type Listing = {
  id: number;
  title: string;
  price: string;
  currency?: string;
  description: string;
  type: string;
  contact: string;
  image: string | null;
  date: string | null;
  owner?: {
    email: string;
    id: string;
  };
  created_at: string;
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

function formatWhatsAppNumber(contact: string): string {
  // Remove all non-digit characters except + at the start
  const cleaned = contact.replace(/[^\d+]/g, '');
  // If it starts with +, use as-is, otherwise assume it's missing country code
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

export default function ListingDetailPage({ params }: PageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/marketplace/${resolvedParams.id}/`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [resolvedParams.id]);

  const handleContactClick = () => {
    if (!user) {
      setError('Please sign in to contact the seller');
      return;
    }

    if (!listing?.contact) {
      setError('No contact information available');
      return;
    }

    // Format contact as WhatsApp number
    const whatsappNumber = formatWhatsAppNumber(listing.contact);
    const message = encodeURIComponent(`Hi, I'm interested in your listing: "${listing.title}"`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-gray-500">Loading listing...</div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Listing not found</p>
            <Link href="/marketplace" className="text-[#dc143c] hover:underline">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center text-[#dc143c] hover:underline mb-6">
          ← Back to Marketplace
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Image Section */}
          {listing.image && (
            <div className="relative w-full h-96 bg-gray-100">
              <Image
                src={buildAbsoluteUrl(DJANGO_API, listing.image)}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  console.error('Failed to load image:', listing.image);
                }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-block bg-[#dc143c] text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {listing.type}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              {listing.owner && (
                <p className="text-gray-600 text-sm">
                  Posted by <span className="font-semibold text-[#dc143c]">{listing.owner.email}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <p className="text-3xl font-bold text-gray-900">
                {listing.price || 'Contact for price'} {listing.currency ? listing.currency : ''}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description || 'No description provided'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Contact Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={handleContactClick}
                className={`inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-lg transition-colors ${
                  user
                    ? 'bg-[#dc143c] text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!user}
              >
                {user ? '💬 Contact Seller on WhatsApp' : '🔒 Sign In to Contact'}
              </Button>
              {user && listing.owner?.id && (
                <button
                  onClick={() => {
                    console.log('Navigating to messages with owner:', listing.owner?.id);
                    const productData = encodeURIComponent(JSON.stringify({
                      id: listing.id,
                      title: listing.title,
                      price: listing.price,
                      image: listing.image,
                    }));
                    router.push(`/messages/${listing.owner!.id}?product=${productData}`);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  📧 Send Direct Message
                </button>
              )}
              {user && !listing.owner?.id && (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                  title="Listing owner information not available"
                >
                  📧 Message Unavailable
                </button>
              )}
              {!user && (
                <Link href="/login">
                  <Button className="px-8 py-3 bg-[#dc143c] text-white hover:bg-red-700">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posted on</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(listing.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Listing ID</p>
                  <p className="font-semibold text-gray-900">#{listing.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
