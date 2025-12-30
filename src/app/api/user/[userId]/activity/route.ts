import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { AuthOptions } from 'next-auth';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export async function GET(
  request: Request,
  context: any
) {
  try {
  const params = await context.params as { userId: string };
    const session = await getServerSession(authOptions as unknown as AuthOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const token = (session as unknown as { accessToken?: string })?.accessToken;
    if (!token) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Ensure the user can only access their own activity
    if (session.user?.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let response = await fetch(`${DJANGO_API}/api/auth/${params.userId}/activity/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Django activity error:', response.status);
      // If 401, try to refresh server session and retry once
      if (response.status === 401) {
        const refreshedSession = await getServerSession(authOptions as unknown as AuthOptions);
        const refreshedToken = (refreshedSession as any)?.accessToken ?? (refreshedSession as any)?.access_token ?? null;
        if (refreshedToken && refreshedToken !== token) {
          response = await fetch(`${DJANGO_API}/api/auth/${params.userId}/activity/`, {
            headers: { 'Authorization': `Bearer ${refreshedToken}`, 'Accept': 'application/json' }
          });
        }
      }
      return NextResponse.json(
        { error: 'Failed to fetch user activity' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in user activity route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}