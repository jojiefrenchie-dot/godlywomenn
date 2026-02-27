'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { formatDistance } from 'date-fns';

interface Prayer {
  id: string;
  title: string;
  content: string;
  author: {
    id?: string;
    username: string;
    profile_image?: string;
  };
  created_at: string;
  supporters_count: number;
  has_user_supported: boolean;
  responses: PrayerResponse[];
}

interface PrayerResponse {
  id: string;
  content: string;
  author: {
    id?: string;
    username: string;
    profile_image?: string;
  };
  created_at: string;
  likes_count: number;
  has_user_liked: boolean;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PrayerPage({ params }: PageProps) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupporting, setIsSupporting] = useState(false);
  const [likedResponses, setLikedResponses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        const response = await fetch(`/api/prayers/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch prayer');
        const data = await response.json();
        setPrayer(data);
      } catch (error) {
        console.error('Error fetching prayer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayer();
  }, [resolvedParams.id]);

  const handleSupport = async () => {
    if (!user) {
      setError('Please log in to support this prayer');
      return;
    }
    setError(null);
    setIsSupporting(true);
    try {
      const method = prayer?.has_user_supported ? 'DELETE' : 'POST';
      const response = await fetch(`/api/prayers/${resolvedParams.id}/support`, {
        method,
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to update support');
      }
      
      setPrayer(prev => prev ? {
        ...prev,
        supporters_count: data.support_count,
        has_user_supported: method === 'POST'
      } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update support';
      setError(message);
      console.error('Error updating support:', err);
    } finally {
      setIsSupporting(false);
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !response.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/prayers/${resolvedParams.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: response }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to submit response');
      }
      
      const newResponse = data;
      setPrayer(prev => prev ? {
        ...prev,
        responses: [...prev.responses, newResponse]
      } : null);
      setResponse('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit response';
      setError(message);
      console.error('Error submitting response:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeResponse = async (responseId: string, hasLiked: boolean) => {
    if (!user) {
      setError('Please log in to like responses');
      return;
    }

    try {
      const method = hasLiked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/prayers/responses/${responseId}/like`, {
        method,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to update like');
      }

      // Update the prayer responses with new like status and count
      setPrayer(prev => prev ? {
        ...prev,
        responses: prev.responses.map(r => 
          r.id === responseId 
            ? {
                ...r,
                likes_count: data.likes_count,
                has_user_liked: method === 'POST'
              }
            : r
        )
      } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update like';
      setError(message);
      console.error('Error updating like:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="container mx-auto px-4 max-w-4xl py-12">
          <div className="text-center text-gray-500">Loading prayer request...</div>
        </div>
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="container mx-auto px-4 max-w-4xl py-12">
          <div className="text-center text-gray-500">Prayer request not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Prayer Header */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{prayer.title}</h1>
            <div className="flex items-center gap-3 text-gray-600 mb-8 text-sm">
              {prayer.author.id ? (
                <Link href={`/profiles/${prayer.author.id}`} className="font-semibold hover:text-[#dc143c] transition">
                  {prayer.author.username}
                </Link>
              ) : (
                <span className="font-semibold">{prayer.author.username}</span>
              )}
              <span className="text-gray-400">•</span>
              <span>{formatDistance(new Date(prayer.created_at), new Date(), { addSuffix: true })}</span>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 mb-8 whitespace-pre-wrap border-l-4 border-[#dc143c] pl-6 py-4 bg-gray-50 rounded">{prayer.content}</p>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}
            <Button 
              onClick={handleSupport}
              disabled={isSupporting}
              className={`inline-flex items-center gap-2 px-6 py-3 text-base font-semibold border-2 rounded-lg transition-colors ${
                prayer.has_user_supported
                  ? 'bg-[#dc143c] text-white border-[#dc143c] hover:bg-red-700 hover:border-red-700'
                  : 'border-[#dc143c] text-[#dc143c] hover:bg-[#dc143c] hover:text-white'
              } ${isSupporting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSupporting ? 'Updating...' : prayer.has_user_supported ? '✓ Praying' : '🙏 Pray'} ({prayer.supporters_count})
            </Button>
          </div>
        </div>

        {/* Responses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Responses ({prayer.responses.length})</h2>
          
          {user ? (
            <form onSubmit={handleSubmitResponse} className="mb-10 bg-white border border-gray-200 rounded-xl p-8 shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Share your response</label>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}
              <textarea
                value={response}
                onChange={(e) => setResponse((e.target as HTMLTextAreaElement).value)}
                placeholder="Write your encouraging message, prayers, or support here..."
                className="mb-4 w-full border border-gray-300 px-4 py-3 rounded-lg min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#dc143c] focus:border-transparent resize-none"
              />
              <Button 
                type="submit" 
                disabled={submitting || !response.trim()}
                className="bg-[#dc143c] text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-3 font-semibold rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </form>
          ) : (
            <div className="mb-10 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <p className="text-blue-900">Please <a href="/login" className="font-bold underline hover:text-blue-700">log in</a> to respond to this prayer request.</p>
            </div>
          )}

          {/* Responses List */}
          <div className="space-y-6">
            {prayer.responses.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-500 text-lg">No responses yet. Be the first to encourage!</p>
              </div>
            ) : (
              prayer.responses.map((prayerResponse) => (
                <div key={prayerResponse.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <span className="font-semibold text-gray-900">{prayerResponse.author.username}</span>
                        <span className="text-gray-400">•</span>
                        <span>
                          {formatDistance(new Date(prayerResponse.created_at), new Date(), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{prayerResponse.content}</p>
                    <button
                      onClick={() => handleLikeResponse(prayerResponse.id, prayerResponse.has_user_liked)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        prayerResponse.has_user_liked
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {prayerResponse.has_user_liked ? '❤️' : '🤍'} ({prayerResponse.likes_count})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

}