'use client';

import { useEffect, useState } from 'react';
import { fetchMarketplace } from '@/lib/api';

interface MarketplaceItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  created_at: string;
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchMarketplace();
        setItems(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load marketplace items');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  if (loading) return <div className="text-center py-20">Loading marketplace...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-[#dc143c] to-[#6B5B95] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="opacity-90">Discover resources from our community</p>
        </div>
      </section>

      <section className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#dc143c]">${item.price}</span>
                  <button className="bg-[#dc143c] text-white px-4 py-2 rounded text-sm hover:bg-[#b50930]">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items found in marketplace</p>
          </div>
        )}
      </section>
    </main>
  );
}
