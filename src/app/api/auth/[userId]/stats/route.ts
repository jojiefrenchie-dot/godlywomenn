import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user can only access their own stats
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';
    const token = (session as any).accessToken;

    let response = await fetch(
      `${djangoApiUrl}/api/auth/${userId}/stats/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Django API error:', response.status, errorData);
      if (response.status === 401) {
        const refreshedSession = await getServerSession(authOptions);
        const refreshedToken = (refreshedSession as any)?.accessToken as string | undefined;
        if (refreshedToken && refreshedToken !== token) {
          response = await fetch(
            `${djangoApiUrl}/api/auth/${userId}/stats/`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${refreshedToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          );
        }
      }
      return NextResponse.json(
        { error: `Django API returned ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}