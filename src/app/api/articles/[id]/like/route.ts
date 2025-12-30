import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { AuthOptions } from 'next-auth';
import { getDjangoApiUrl } from '@/lib/api';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as unknown as AuthOptions);
    const token = (session as any)?.accessToken ?? (session as any)?.access_token;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const resp = await fetch(getDjangoApiUrl(`/api/articles/${id}/like/`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error('Error liking article:', error);
    return NextResponse.json({ error: 'Failed to like article' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as unknown as AuthOptions);
    const token = (session as any)?.accessToken ?? (session as any)?.access_token;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const resp = await fetch(getDjangoApiUrl(`/api/articles/${id}/like/`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // 204 No Content has no response body
    if (resp.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    console.error('Error unliking article:', error);
    return NextResponse.json({ error: 'Failed to unlike article' }, { status: 500 });
  }
}