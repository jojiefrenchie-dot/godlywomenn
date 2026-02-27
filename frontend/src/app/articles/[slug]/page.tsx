'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchArticleBySlug } from '@/lib/api';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  category: string;
  created_at: string;
  sender_name: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleBySlug(slug);
        setArticle(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading article...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  if (!article) return <div className="text-center py-20">Article not found</div>;

  return (
    <main className="flex-1">
      {article.featured_image && (
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="text-sm font-semibold text-[#dc143c] uppercase">
            {article.category}
          </span>
          <h1 className="text-4xl font-bold my-4">{article.title}</h1>
          <p className="text-gray-600">
            {new Date(article.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  );
}
