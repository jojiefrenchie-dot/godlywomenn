import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

// Helper function to ensure absolute URLs without using the URL constructor
function getAbsoluteUrl(path: string) {
  if (!path) return '';
  // If path is already absolute, return it
  if (/^https?:\/\//i.test(path)) return path;
  const base = String(DJANGO_API || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}

export async function GET(request: NextRequest, context: any) {
  const params = await context.params as { slug: string };
  try {
    // Get the authorization token from headers
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
  const url = getAbsoluteUrl(`/api/articles/by-slug/${encodeURIComponent(params.slug)}/`);
    const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const data = await response.json();
    console.log('Article data from backend:', {
      title: data.title,
      contentLength: data.content?.length || 0,
      hasContent: Boolean(data.content),
      featured_image: data.featured_image,
      status: data.status
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}