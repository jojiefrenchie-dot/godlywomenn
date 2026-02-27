'use client';

import { useEffect, useState } from 'react';
import { fetchPrayers } from '@/lib/api';

interface Prayer {
  id: number;
  title: string;
  description: string;
  created_at: string;
  sender_name: string;
}

export default function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrayers = async () => {
      try {
        const data = await fetchPrayers();
        setPrayers(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load prayers');
      } finally {
        setLoading(false);
      }
    };

    loadPrayers();
  }, []);

  if (loading) return <div className="text-center py-20">Loading prayers...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-[#dc143c] to-[#6B5B95] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Prayer Requests</h1>
          <p className="opacity-90">Join our community in prayer</p>
        </div>
      </section>

      <section className="container-custom py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {prayers.map((prayer) => (
            <div key={prayer.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{prayer.title}</h3>
              <p className="text-gray-600 mb-4">{prayer.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>by {prayer.sender_name}</span>
                <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
              </div>
              <button className="mt-4 bg-[#dc143c] text-white px-6 py-2 rounded hover:bg-[#b50930] w-full">
                Pray for this request
              </button>
            </div>
          ))}
        </div>

        {prayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No prayer requests found</p>
          </div>
        )}
      </section>
    </main>
  );
}
