import { NextResponse } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: 'No authorization header' }, { status: 401 });
    }

    // Call Django logout endpoint
    const response = await fetch(`${DJANGO_API}/api/auth/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
    });

    // Django logout might return 200 or 204
    if (!response.ok && response.status !== 204) {
      console.warn('[LOGOUT] Django logout warning:', response.status);
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[LOGOUT] Error:', error);
    console.error('[LOGOUT] Error details:', errorMsg);
    return NextResponse.json({ message: `Server error: ${errorMsg}` }, { status: 500 });
  }
}

