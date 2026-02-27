'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchArticles } from '@/lib/api';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featured_image: string;
  created_at: string;
  sender_name: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) return <div className="text-center py-20">Loading articles...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-[#dc143c] to-[#6B5B95] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Articles</h1>
          <p className="opacity-90">Read inspiring articles from our community</p>
        </div>
      </section>

      <section className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                {article.featured_image && (
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-[#dc143c] uppercase mb-2">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1">{article.excerpt}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found</p>
          </div>
        )}
      </section>
    </main>
  );
}
