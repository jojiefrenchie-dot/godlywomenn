'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/media/')) {
    const b = String(base || '').replace(/\/$/, '');
    return b + path;
  }
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string;
  location: string;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
}

interface UserStats {
  articles_count: number;
  comments_count: number;
  prayers_count: number;
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        // Fetch user data - use proxy for CORS compatibility
        const userRes = await fetch(`/api/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!userRes.ok) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const userData = await userRes.json();
        setProfile({
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          image: userData.image,
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website,
          facebook: userData.facebook,
          twitter: userData.twitter,
          instagram: userData.instagram,
        });

        // Fetch stats - requires authentication
        const statsRes = await fetch(`/api/user/${userId}/stats`, {
          headers: {
            'Authorization': `Bearer ${accessToken || ''}`,
          }
        });

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            articles_count: statsData.articlesRead || 0,
            comments_count: statsData.commentsCount || 0,
            prayers_count: statsData.prayersPosted || 0,
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error || 'Profile not found'}</div>
      </div>
    );
  }

  const isCurrentUser = user?.email === profile.email;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {profile.image ? (
            <Image
              src={profile.image.startsWith('/') ? `/api${profile.image}` : `/api/media/${profile.image}`}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full object-cover w-24 h-24"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          <div className="flex-grow">
            <h1 className="text-3xl font-serif text-gray-900 mb-2">{profile.name}</h1>
            {profile.bio && (
              <p className="text-gray-700 mb-4">{profile.bio}</p>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {profile.location && (
                <p>📍 {profile.location}</p>
              )}
              {profile.website && (
                <p>
                  🌐{' '}
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#dc143c] hover:underline">
                    Website
                  </a>
                </p>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {profile.facebook && (
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  Facebook
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                  Twitter
                </a>
              )}
              {profile.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                  Instagram
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {isCurrentUser ? (
                <Link
                  href="/dashboard/profile"
                  className="px-4 py-2 bg-[#dc143c] text-white rounded-lg hover:bg-red-700 transition"
                >
                  Edit Profile
                </Link>
              ) : (
                <Link
                  href={`/messages/${profile.id}`}
                  className="px-4 py-2 bg-[#dc143c] text-white rounded-lg hover:bg-red-700 transition"
                >
                  💬 Start Chat
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#dc143c]">{stats.articles_count}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#dc143c]">{stats.comments_count}</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#dc143c]">{stats.prayers_count}</div>
              <div className="text-sm text-gray-600">Prayers</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
