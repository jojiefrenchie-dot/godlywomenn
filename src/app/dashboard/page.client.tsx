"use client";

import { useAuth } from '@/lib/AuthContext';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { getUserArticles, getUserStats, getUserActivity, type UserActivity, type UserStats } from '@/lib/user-articles';
import ArticleCard, { Article } from '../components/ArticleCard';

// Button intentionally not used here but kept for future UI updates

const quickActions = [
  {
    title: "Write Article",
    description: "Share your thoughts and insights",
    href: "/dashboard/articles/new",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: "Marketplace",
    description: "Manage your products, services and events",
    href: "/dashboard/marketplace",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7" />
      </svg>
    ),
  },
  {
    title: "My Chats",
    description: "View and manage your conversations",
    href: "/dashboard/chats",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Post Prayer",
    description: "Share prayer requests and testimonies",
    href: "/dashboard/prayers/new",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Edit Profile",
    description: "Update your personal information",
    href: "/dashboard/profile",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function DashboardPageClient() {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);
  
  const [articles, setArticles] = useState<Array<Article>>([]);
  const [stats, setStats] = useState<UserStats>({
    articlesRead: 0,
    prayersPosted: 0,
    daysActive: 0
  });
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) {
        console.log('[DASHBOARD] No user ID yet');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('[DASHBOARD] User exists:', user);
        console.log('[DASHBOARD] Fetching user articles...');
        
        const token = localStorage.getItem('accessToken') || '';
        console.log('[DASHBOARD] Access token available:', !!token);

        // Try to fetch articles first - this is the most important part
        let articlesData = [];
        try {
          articlesData = await getUserArticles(user.id, token);
          console.log('[DASHBOARD] Articles fetched successfully:', articlesData?.length || 0);
        } catch (articleError) {
          console.error('[DASHBOARD] Article fetch error:', articleError);
          articlesData = [];
        }

        // Try to fetch stats - but don't fail if it doesn't work
        let statsData = {
          articlesRead: 0,
          prayersPosted: 0,
          daysActive: 0
        };
        try {
          statsData = await getUserStats(user.id, token);
          console.log('[DASHBOARD] Stats fetched successfully:', statsData);
        } catch (statsError) {
          console.error('[DASHBOARD] Stats fetch error (non-critical):', statsError);
          // Use defaults
        }

        // Try to fetch activity - but don't fail if it doesn't work
        let activityData: UserActivity[] = [];
        try {
          activityData = await getUserActivity(user.id);
          console.log('[DASHBOARD] Activity fetched successfully:', activityData?.length || 0);
        } catch (activityError) {
          console.error('[DASHBOARD] Activity fetch error (non-critical):', activityError);
          // Use empty array
        }

        // Set all data regardless of what succeeded
        if (Array.isArray(articlesData)) {
          setArticles(articlesData);
        } else {
          setArticles([]);
        }

        setStats(statsData);

        if (Array.isArray(activityData)) {
          setRecentActivity(activityData);
        }

        console.log('[DASHBOARD] All data loaded');

      } catch (error) {
        console.error('[DASHBOARD] Unexpected error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to load dashboard data';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc143c]"></div>
      </div>
    );
  }

  const userName = user?.name || "Friend";

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-b from-white to-[#fdebd0]/20 pt-20">
      <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading Message */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#dc143c] mr-3"></div>
            <p className="text-blue-700">Loading your dashboard...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error Loading Dashboard</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-red-600 text-xs mt-2">
              Please check the browser console for more details. If the problem persists, try signing in again.
            </p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-600">Your journey of faith continues. What would you like to do today?</p>
        </div>

        {/* Quick Stats */}
        <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div suppressHydrationWarning className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div suppressHydrationWarning className="text-[#dc143c] font-semibold text-2xl mb-1">{stats.articlesRead}</div>
            <div suppressHydrationWarning className="text-gray-600">Articles Read</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-[#dc143c] font-semibold text-2xl mb-1">{stats.prayersPosted}</div>
            <div className="text-gray-600">Prayers Posted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-[#dc143c] font-semibold text-2xl mb-1">{stats.daysActive}</div>
            <div className="text-gray-600">Days Active</div>
          </div>
        </div>

        {/* Quick Actions Section - Always Show */}
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="group bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="text-[#dc143c] mb-4">{action.icon}</div>
              <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#dc143c] transition-colors">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-12 divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4">
                  <div className="text-sm text-gray-600">{activity.date}</div>
                  <div className="mt-1">
                    {activity.type}: &quot;{activity.title}&quot;
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Your Articles */}
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Your Articles</h2>
        <div suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
          {articles.length === 0 && (
            <div suppressHydrationWarning className="col-span-full text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">You haven't published any articles yet</p>
              <Link href="/articles/create" className="inline-block px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#dc143c]/90">
                Write Your First Article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
