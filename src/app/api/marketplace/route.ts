import { NextResponse, NextRequest } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization') || '';
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const resp = await fetch(`${DJANGO_API}/api/marketplace/`, {
      method: 'GET',
      headers,
    });
    
    const json = await resp.json().catch(() => []);
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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization') || '';
    
    if (!token) {
      console.error('No authorization header in POST request');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    console.log('POST /api/marketplace - Content-Type:', contentType, 'Token:', token.substring(0, 20) + '...');

    // If multipart form (file upload), forward the raw body stream and avoid setting Content-Type so boundary is preserved
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing multipart form data...');
      const headers: Record<string, string> = {
        'Authorization': token,
        'Content-Type': contentType
      };

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
    
    const headers: Record<string, string> = {
      'Authorization': token,
      'Content-Type': 'application/json'
    };

    const resp = await fetch(`${DJANGO_API}/api/marketplace/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await resp.json().catch(() => ({}));
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

