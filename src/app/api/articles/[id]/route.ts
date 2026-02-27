import { NextResponse, NextRequest } from 'next/server';
import { getBackendApiUrl } from '@/lib/api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const authHeader = (req as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const resp = await fetch(getBackendApiUrl(`/api/articles/${encodeURIComponent(id)}/`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) {
      const json = await resp.json().catch(() => ({}));
      console.error('Django delete article error', resp.status, json);
      return NextResponse.json({ error: json }, { status: resp.status });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Unhandled delete error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const authHeader = (req as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    const resp = await fetch(getBackendApiUrl(`/api/articles/${id}/`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error('Django update article error', resp.status, json);
      return NextResponse.json({ error: json }, { status: resp.status });
    }

    return NextResponse.json(json);
  } catch (e) {
    console.error('Unhandled update error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
