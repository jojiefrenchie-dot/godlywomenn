import { fetchWithAuth, getDjangoApiUrl } from './api';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export interface UserStats {
  articlesRead: number;
  prayersPosted: number;
  daysActive: number;
}

export interface UserActivity {
  type: string;
  title: string;
  date: string;
}

export async function getUserStats(userId: string, token?: string): Promise<UserStats> {
  if (!userId) {
    console.error('Missing required parameters:', { userId: !!userId });
    throw new Error('Authentication required');
  }

  try {
    const url = `/api/auth/${encodeURIComponent(userId)}/stats`;
    
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default stats on error instead of throwing
    return {
      articlesRead: 0,
      prayersPosted: 0,
      daysActive: 0
    };
  }
}

export async function getUserActivity(userId: string): Promise<UserActivity[]> {
  if (!userId) {
    console.error('Missing user ID');
    throw new Error('User ID required');
  }

  try {
    const response = await fetchWithAuth(`/api/user/${encodeURIComponent(userId)}/activity`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }
}

export async function getUserArticles(userId: string, token: string) {
  if (!userId || !token) {
    console.error('Missing required parameters:', { userId: !!userId, token: !!token });
    throw new Error('Authentication required');
  }

  const url = `/api/articles?author=${encodeURIComponent(userId)}`;
  
  try {
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching user articles:', error);
    return [];
  }
}