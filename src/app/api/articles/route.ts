import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { Session, AuthOptions } from 'next-auth';
import { getDjangoApiUrl, fetchWithAuth } from '@/lib/api';

export async function POST(req: Request) {
  try {
    // Try server session first (browser flow)
    const session = await getServerSession(authOptions as unknown as AuthOptions);
    let token: string | undefined;
    if (session) {
      // Log session data for debugging
      console.log('Session data:', {
        user: session.user,
        hasAccessToken: !!((session as any).accessToken || (session as any).access_token)
      });
      token = (session as any)?.accessToken ?? (session as any)?.access_token;
    }

    // If no server session, allow passing a Bearer token in the Authorization header
    // This makes the route usable for programmatic requests that include a token.
    if (!token) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice(7).trim();
        console.log('Using bearer token from Authorization header');
      }
    }

    if (!token) {
      console.error('No session or bearer token found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, featured_image, category_id, status } = body;

    console.log('Article creation request received:', { title, excerpt, category_id, status, hasFeaturedImage: !!featured_image });

    // Transform data for Django API
    // Send featured_image_url if provided (will be stored in the featured_image model field)
    const postData: any = {
      title,
      content,
      excerpt: excerpt || '',
      category_id, // Use category_id as expected by the Django serializer
      status: status || 'draft'
    };
    
    if (featured_image) {
      postData.featured_image_url = featured_image;
    }

    console.log('Sending to Django:', postData);

    try {
      // Use direct fetch here so we can read Django's validation errors (400)
      const resp = await fetch(getDjangoApiUrl('/api/articles/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      // Read body as text first so we can handle invalid JSON gracefully
      const text = await resp.text();
      let json: any = null;
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          json = JSON.parse(text);
        } catch (parseErr) {
          console.error('Failed to parse JSON from Django:', parseErr, text);
          // If parsing fails but the response was OK, return text as message
          if (resp.ok) {
            const payload = { message: text || 'Created' };
            console.log('Returning to client (text payload):', payload);
            return NextResponse.json(payload, { status: 201 });
          }
          return NextResponse.json({ error: 'Invalid JSON from server' }, { status: 502 });
        }
      }

      console.log('Django create article response status:', resp.status, 'parsed json:', json, 'raw text:', text);

      if (!resp.ok) {
        console.error('Django create article error:', resp.status, json || text);

        // If Django returned validation errors (400), forward them
        if (resp.status === 400 && json && typeof json === 'object') {
          const errors = Object.entries(json)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          const payload = { error: errors };
          console.log('Returning to client (validation errors):', payload);
          return NextResponse.json(payload, { status: 400 });
        }

        // Otherwise forward message/detail if available
        const payload = { error: json?.detail || json?.message || text || 'Failed to create article' };
        console.log('Returning to client (error):', payload);
        return NextResponse.json(payload, { status: resp.status });
      }

      // Success: ensure we return a JSON payload (avoid returning null/empty)
      const successPayload = json ?? (text ? { message: text } : { message: 'Created' });
      console.log('Returning to client (success):', successPayload);
      return NextResponse.json(successPayload, { status: 201 });
    } catch (err) {
      console.error('Error calling Django API:', err);
      return NextResponse.json(
        { error: 'Failed to communicate with the server' },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error('Unhandled exception in API create article:', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Build target URL with query string forwarded
    const requestUrl = new URL(req.url);
    const search = requestUrl.search || '';
    const target = getDjangoApiUrl(`/api/articles/${search}`);

    // Try to get server session token first
    const session = await getServerSession(authOptions as unknown as AuthOptions);
    let token: string | undefined;
    if (session) {
      token = (session as any)?.accessToken ?? (session as any)?.access_token;
    }

    // If no server session, allow passing a Bearer token in the Authorization header
    if (!token) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice(7).trim();
      }
    }

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(target, { method: 'GET', headers });

    const text = await resp.text();
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const json = JSON.parse(text);
        return NextResponse.json(json, { status: resp.status });
      } catch (err) {
        console.error('Failed to parse JSON from Django GET /api/articles:', err, text);
        return NextResponse.json({ error: text || 'Invalid JSON from server' }, { status: 502 });
      }
    }

    // Non-JSON response: return as text
    return NextResponse.json({ message: text }, { status: resp.status });
  } catch (err) {
    console.error('Error proxying GET /api/articles:', err);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}
