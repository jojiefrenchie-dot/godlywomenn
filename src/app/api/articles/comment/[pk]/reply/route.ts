import { NextResponse, NextRequest } from 'next/server';

import { getDjangoApiUrl } from '@/lib/api';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pk: string }> }
) {
  try {
    const { pk } = await params;
    
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();

    const resp = await fetch(getDjangoApiUrl(`/api/articles/comment/${pk}/reply/`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error('Error replying to comment:', error);
    return NextResponse.json({ error: 'Failed to reply to comment' }, { status: 500 });
  }
}