import { NextResponse } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function GET(
  request: Request,
  context: any
) {
  try {
  const params = await context.params as { userId: string };
    const authHeader = (request as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Note: User ID validation happens in Django API

    const response = await fetch(`${DJANGO_API}/api/auth/${params.userId}/activity/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Django activity error:', response.status);
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