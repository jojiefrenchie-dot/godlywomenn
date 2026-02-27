 'use client';

import Image from 'next/image';
import ClientImage from './ClientImage';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLike } from '@/app/providers/LikeContext';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

/**
 * Build absolute URL for media files
 * 
 * For /media/* paths, uses the Next.js proxy endpoint for better compatibility
 * For other paths, builds full URL using Django API base
 */
function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  
  // If already a full URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  
  // For media files, use Next.js proxy endpoint
  // This ensures images work even if Django doesn't serve media directly
  if (path.startsWith('/media/')) {
    // Remove leading slash and use Next.js proxy
    const mediaPath = path.replace(/^\/media\//, '');
    return `/api/media/${mediaPath}`;
  }
  
  // For other paths, build full URL with Django API
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  created_at?: string;
  published_at: string;
  view_count: number;
  status?: 'draft' | 'published';
  likes_count?: number;
  user_liked?: boolean;
}

interface ArticleCardProps {
  article: Article;
  onLike?: (slug: string, liked: boolean) => Promise<void>;
  onStatusChange?: (status: string) => void;
}

export default function ArticleCard({
  article,
  onLike,
  onStatusChange,
}: ArticleCardProps) {
  const { user } = useAuth();
  const { likes, setLike } = useLike();
  const [isLikingLocal, setIsLikingLocal] = useState(false);

  // Get like state from context or fall back to article props
  const likeState = likes[article.id] || { liked: article.user_liked || false, count: article.likes_count || 0 };
  const userLiked = likeState.liked;
  const likesCount = likeState.count;

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like articles');
      return;
    }

    setIsLikingLocal(true);
    try {
      // Optimistically update UI
      const newLiked = !userLiked;
      const newCount = newLiked ? likesCount + 1 : likesCount - 1;
      setLike(article.id, newLiked, newCount);

      // Make API call
      const endpoint = `/api/articles/${article.id}/like`;
      
      const response = await fetch(endpoint, {
        method: userLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // Revert on error
        setLike(article.id, userLiked, likesCount);
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.error || 'Failed to like article');
      }
    } catch (error) {
      console.error('Error liking article:', error);
      alert('Failed to like article');
    } finally {
      setIsLikingLocal(false);
    }
  };

  const publicDate = article.published_at
    ? new Date(article.published_at)
    : null;
  const timeAgo = publicDate
    ? formatDistanceToNow(publicDate, { addSuffix: true })
    : '';

  return (
    <article suppressHydrationWarning className="flex flex-col h-full rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {article.featured_image && (
        <Link
          suppressHydrationWarning
          href={'/articles/' + article.slug}
          className="relative block w-full h-48 bg-gray-200 overflow-hidden flex-shrink-0"
        >
          {/* Client-only image to avoid hydration mismatches from injected attributes */}
          <ClientImage
            src={buildAbsoluteUrl(DJANGO_API, article.featured_image)}
            alt={article.title}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={'/articles?category=' + article.category.slug}
          className="mb-2 w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-200"
        >
          {article.category.name}
        </Link>

        <Link href={'/articles/' + article.slug} className="mb-2 block flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {article.excerpt && (
          <p className="mb-3 flex-1 text-sm text-gray-600 line-clamp-2">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          {article.author.image && (
            <ClientImage
              src={buildAbsoluteUrl(DJANGO_API, article.author.image)}
              alt={article.author.name || 'Author'}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <Link href={`/profiles/${article.author.id}`} className="hover:text-[#dc143c] transition">
            {article.author.name}
          </Link>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{article.view_count || 0} views</span>
          </div>

          <button
            onClick={handleLike}
            disabled={isLikingLocal}
            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              userLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            <span>{userLiked ? '❤️' : '🤍'}</span>
            <span>{likesCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}