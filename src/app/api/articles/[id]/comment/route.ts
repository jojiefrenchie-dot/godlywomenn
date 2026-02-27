import { NextResponse, NextRequest } from 'next/server';
import { getDjangoApiUrl } from '@/lib/api';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = (req as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Comment request body:', body);
    console.log('Target URL:', getDjangoApiUrl(`/api/articles/${id}/comment/`));
    console.log('Auth token:', token ? 'present' : 'missing');

    const resp = await fetch(getDjangoApiUrl(`/api/articles/${id}/comment/`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    console.log('Comment response status:', resp.status, 'data:', data);
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}