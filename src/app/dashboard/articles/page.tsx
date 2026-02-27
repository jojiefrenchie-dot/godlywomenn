'use client';

import { useAuth } from '@/lib/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import type { Article } from '@/lib/articles';

export default function DashboardArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      redirect('/login');
    }
    
    async function fetchArticles() {
      if (!user?.id) return;
      try {
        const { articles } = await getArticles({ 
          includeAll: true,
          authorId: user.id
        });
        setArticles(articles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticles();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900">My Articles</h1>
        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#dc143c] hover:bg-[#b0102f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc143c]"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc143c] mx-auto"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/articles/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#dc143c] hover:bg-[#b0102f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc143c]"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Article
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {articles.map((article: Article) => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-lg font-medium text-[#dc143c] truncate hover:underline"
                      >
                        {article.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-600 truncate">{article.excerpt}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-[#dc143c] hover:bg-[#b0102f]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                    <span>Status: {article.status}</span>
                    <span>•</span>
                    <span suppressHydrationWarning>
                      Created: {new Date(article.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}