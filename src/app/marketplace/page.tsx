"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

  const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://127.0.0.1:8000';

  function buildAbsoluteUrl(base: string, path: string) {
    if (!path) return '';
    // If already absolute HTTP(S), return as-is
    if (/^https?:\/\//i.test(path)) return path;
    // If starts with /media/, use Next.js proxy endpoint for compatibility
    if (path.startsWith('/media/')) {
      const mediaPath = path.replace(/^\/media\//, '');
      return `/api/media/${mediaPath}`;
    }
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
  owner?: { id: string | number; username?: string } | null;
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        setError(null);
        const url = `/api/marketplace`;
        console.log('Fetching from:', url);
        
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`HTTP ${res.status}: ${errorText}`);
          throw new Error(`Failed to fetch listings: HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Listings data received:', data);
        
        // Handle both array and object responses
        if (Array.isArray(data)) {
          setListings(data);
        } else if (data && typeof data === 'object') {
          // If data is an object, check for common response patterns
          const listingsArray = data.results || data.data || data.listings || [];
          setListings(Array.isArray(listingsArray) ? listingsArray : []);
        } else {
          console.warn('Unexpected data format:', data);
          setListings([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch listings';
        console.error('Error fetching marketplace listings:', err);
        setError(errorMessage);
        setListings([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const categories = ['All', 'Product', 'Service', 'Event'];
  const filteredListings = (selectedCategory === 'All' 
    ? listings 
    : listings.filter(listing => listing.type === selectedCategory))
  .filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactClick = (e: React.MouseEvent, listing: Listing) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Store the intended action and redirect to login
      window.location.href = '/login';
      return;
    }

    if (!listing.contact) {
      alert('No contact information available');
      return;
    }

    const whatsappNumber = formatWhatsAppNumber(listing.contact);
    const message = encodeURIComponent(`Hi, I'm interested in your listing: "${listing.title}"`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif mb-4 text-[#dc143c]">
          Marketplace
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover resources, services, and products to support your journey as a Christian business woman.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error loading listings</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Please make sure the backend server is running and accessible at {DJANGO_API} marketplace
          </p>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-[#dc143c] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8 mb-12 border border-red-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-[#dc143c] mb-4 text-center">
            Search Listings
          </h2>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dc143c] focus:border-transparent text-lg"
          />
          {searchTerm && (
            <p className="text-center text-gray-600 mt-3 text-sm">
              Found {filteredListings.length} result{filteredListings.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12">Loading...</div>
        ) : filteredListings.length === 0 ? (
          <div className="col-span-3 text-center py-12">No listings found in this category.</div>
        ) : (
          filteredListings.map((listing) => (
            <div key={listing.id}>
              <Link href={`/marketplace/${listing.id}`}>
                <div
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                >
                  {listing.image && (
                    <div className="relative aspect-video bg-gray-100">
                      <Image
                        src={buildAbsoluteUrl(DJANGO_API, listing.image)}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          console.error('Failed to load image:', listing.image);
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm font-medium text-[#dc143c] mb-2">
                    {listing.type}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  {listing.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                      {listing.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {listing.price || 'Contact for price'} {listing.currency ? listing.currency : ''}
                    </span>
                    <div className="flex gap-2">
                      {listing.contact && (
                        <button 
                          onClick={(e) => handleContactClick(e, listing)}
                          className={`px-4 py-2 rounded-md transition-colors ${
                            user
                              ? 'bg-[#dc143c] text-white hover:bg-red-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!user}
                          title={user ? 'Contact seller on WhatsApp' : 'Sign in to contact'}
                        >
                          {user ? '💬' : '🔒'}
                        </button>
                      )}
                      {user && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Navigate to the detail page first to ensure we have all data
                            router.push(`/marketplace/${listing.id}`);
                          }}
                          className="px-4 py-2 rounded-md transition-colors bg-green-600 text-white hover:bg-green-700"
                          title="Send direct message"
                        >
                          📧
                        </button>
                      )}
                      {!user && !listing.contact && (
                        <button 
                          className="px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed"
                          disabled
                          title="Sign in to contact"
                        >
                          🔒
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
