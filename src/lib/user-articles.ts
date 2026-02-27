// user-articles.ts - User article utilities and types

export interface UserStats {
  totalArticles: number;
  totalPrayers: number;
  totalMarketplaceItems: number;
  totalMessages: number;
  viewCount: number;
  likeCount: number;
}

export interface UserActivity {
  id: string;
  type: 'article' | 'prayer' | 'marketplace' | 'message';
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUserArticles(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/articles?userId=${userId}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching user articles:', error);
    return [];
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/users/${userId}/stats`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      return {
        totalArticles: 0,
        totalPrayers: 0,
        totalMarketplaceItems: 0,
        totalMessages: 0,
        viewCount: 0,
        likeCount: 0,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalArticles: 0,
      totalPrayers: 0,
      totalMarketplaceItems: 0,
      totalMessages: 0,
      viewCount: 0,
      likeCount: 0,
    };
  }
}

export async function getUserActivity(userId: string): Promise<UserActivity[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/users/${userId}/activity`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }
}
