import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { AuthOptions, Session } from 'next-auth';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const resp = await fetch(`${DJANGO_API}/api/marketplace/`);
    const json = await resp.json();
    if (!resp.ok) {
      console.error('Django marketplace list error', resp.status, json);
      return NextResponse.json({ error: 'Failed to fetch marketplace items' }, { status: resp.status });
    }
    return NextResponse.json(json);
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json({ error: 'Failed to fetch marketplace items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as unknown as AuthOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const token = (session as unknown as { accessToken?: string })?.accessToken;
    if (!token) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    console.log('POST /api/marketplace - Content-Type:', contentType);

    // If multipart form (file upload), forward the raw body stream and avoid setting Content-Type so boundary is preserved
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing multipart form data...');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      // preserve content-type (boundary) so Django can parse multipart
      headers['Content-Type'] = contentType;

      const arr = await request.arrayBuffer();
      console.log('Request body size:', arr.byteLength, 'bytes');
      
      const resp = await fetch(`${DJANGO_API}/api/marketplace/`, {
        method: 'POST',
        headers,
        body: Buffer.from(arr as any),
      });

      const json = await resp.json().catch(() => ({}));
      console.log('Django response status:', resp.status, 'body:', json);
      
      if (!resp.ok) {
        console.error('Django create marketplace item error', resp.status, json);
        return NextResponse.json({ error: 'Failed to create marketplace item', detail: json }, { status: resp.status });
      }
      return NextResponse.json(json, { status: 201 });
    }

    console.log('Processing JSON request...');
    const body = await request.json();
    console.log('Request body:', body);
    
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(`${DJANGO_API}/api/marketplace/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    console.log('Django response status:', resp.status, 'body:', json);
    
    if (!resp.ok) {
      console.error('Django create marketplace item error', resp.status, json);
      return NextResponse.json({ error: 'Failed to create marketplace item', detail: json }, { status: resp.status });
    }

    return NextResponse.json(json, { status: 201 });
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    return NextResponse.json({ error: 'Failed to create marketplace item', detail: String(error) }, { status: 500 });
  }
}
