import { NextResponse, NextRequest } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    console.log('GET /api/marketplace/[id] - ID:', id);

    const resp = await fetch(`${DJANGO_API}/api/marketplace/${id}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!resp.ok) {
      const json = await resp.json().catch(() => ({}));
      console.error('Django get marketplace item error', resp.status, json);
      return NextResponse.json({ error: 'Failed to get marketplace item', detail: json }, { status: resp.status });
    }

    const json = await resp.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error('Error getting marketplace item:', error);
    return NextResponse.json({ error: 'Failed to get marketplace item', detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const contentType = req.headers.get('content-type') || '';
    console.log('PATCH /api/marketplace/[id] - ID:', id, 'Content-Type:', contentType);
    
    // Get token from Authorization header
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (contentType.includes('multipart/form-data')) {
      console.log('Processing multipart form data for update...');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      headers['Content-Type'] = contentType;
      const arr = await req.arrayBuffer();
      console.log('Request body size:', arr.byteLength, 'bytes');
      
      const resp = await fetch(`${DJANGO_API}/api/marketplace/${id}/`, {
        method: 'PATCH',
        headers,
        body: Buffer.from(arr as any),
      });
      const json = await resp.json().catch(() => ({}));
      console.log('Django response status:', resp.status, 'body:', json);
      
      if (!resp.ok) {
        console.error('Django update marketplace item error', resp.status, json);
        return NextResponse.json({ error: 'Failed to update marketplace item', detail: json }, { status: resp.status });
      }
      return NextResponse.json(json);
    }

    console.log('Processing JSON request for update...');
    const body = await req.json();
    console.log('Request body:', body);
    
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(`${DJANGO_API}/api/marketplace/${id}/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    console.log('Django response status:', resp.status, 'body:', json);
    
    if (!resp.ok) {
      console.error('Django update marketplace item error', resp.status, json);
      return NextResponse.json({ error: 'Failed to update marketplace item', detail: json }, { status: resp.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    return NextResponse.json({ error: 'Failed to update marketplace item', detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(`${DJANGO_API}/api/marketplace/${id}/`, {
      method: 'DELETE',
      headers,
    });

    if (!resp.ok) {
      const json = await resp.json().catch(() => ({}));
      console.error('Django delete marketplace item error', resp.status, json);
      return NextResponse.json({ error: json }, { status: resp.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    return NextResponse.json({ error: 'Failed to delete marketplace item' }, { status: 500 });
  }
}
