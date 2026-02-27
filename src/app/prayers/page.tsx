'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import Link from 'next/link';

interface Prayer {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    profile_image?: string;
  };
  created_at: string;
  support_count: number;
  response_count: number;
}

export default function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const response = await fetch('/api/prayers');
        if (!response.ok) throw new Error('Failed to fetch prayers');
        const data = await response.json();
        setPrayers(data);
      } catch (error) {
        console.error('Error fetching prayers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading prayers...</div>;
  }

  if (!prayers || prayers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Prayer Requests</h1>
          <Link href="/prayers/create">
            <Button>Share Your Prayer</Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No prayer requests yet.</p>
          <p className="text-gray-500 mb-4">Be the first to share a prayer request!</p>
          <Link href="/prayers/create">
            <Button>Create First Prayer</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prayer Requests</h1>
        <Link href="/prayers/create">
          <Button>Share Your Prayer</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prayers.map((prayer) => (
          <Link key={prayer.id} href={`/prayers/${prayer.id}`}>
            <div className="h-full hover:shadow-lg transition-shadow border rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{prayer.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{prayer.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>By {prayer.author.username}</span>
                  </div>
                  <div className="flex gap-4">
                    <span>{prayer.support_count} Prayers</span>
                    <span>{prayer.response_count} Responses</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}