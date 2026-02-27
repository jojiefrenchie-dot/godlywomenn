'use client';

import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ArticleActionsProps = {
  articleId: string;
  authorId: string;
  slug: string;
  status?: 'draft' | 'published';
};

export default function ArticleActions({ articleId, authorId, slug, status = 'draft' }: ArticleActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'draft' | 'published'>(status);

  const isAuthor = user?.id === authorId;

  if (!isAuthor) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    setError('');

    try {
      const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
      const res = await fetch(`/api/articles/${encodeURIComponent(articleId)}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to update article status' }));
        throw new Error(data.error || 'Failed to update article status');
      }

      setCurrentStatus(newStatus);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update article status');
      console.error('Publish error:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(articleId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to delete article' }));
        throw new Error(data.error || 'Failed to delete article');
      }

      router.push('/dashboard/articles');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete article');
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4 mt-8 pt-8 border-t border-gray-100">
      {error && (
        <div className="text-red-500 text-sm w-full p-3 bg-red-50 border border-red-200 rounded">{error}</div>
      )}
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc143c] disabled:opacity-50 ${
            currentStatus === 'draft'
              ? 'bg-[#dc143c] hover:bg-[#b01031]'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isPublishing ? 'Processing...' : currentStatus === 'draft' ? 'Publish' : 'Unpublish'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {isDeleting ? 'Deleting...' : 'Delete Article'}
        </button>
      </div>
      {currentStatus && (
        <div className="text-xs text-gray-500">
          Current status: <span className={`font-semibold ${currentStatus === 'published' ? 'text-green-600' : 'text-orange-600'}`}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}