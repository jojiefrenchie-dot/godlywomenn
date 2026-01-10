import { NextRequest, NextResponse } from 'next/server';
import { getDjangoApiUrl } from '@/lib/api';

/**
 * Media proxy endpoint
 * 
 * Proxies media requests through Next.js to handle:
 * 1. Image loading from Django backend
 * 2. Proper cache headers for static assets
 * 3. CORS headers for image loading
 * 4. Error handling and fallbacks
 * 
 * Usage: /api/media/articles/2025/01/filename.jpg
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    
    if (!path || path.length === 0) {
      return NextResponse.json(
        { error: 'No media path specified' },
        { status: 400 }
      );
    }

    // Reconstruct the media path
    const mediaPath = path.join('/');
    
    // Build Django URL - directly use DJANGO_API without calling getDjangoApiUrl
    const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';
    const djangoUrl = `${DJANGO_API.replace(/\/$/, '')}/media/${mediaPath}`;
    
    console.log('[MEDIA PROXY] Request path:', mediaPath);
    console.log('[MEDIA PROXY] Django API URL:', DJANGO_API);
    console.log('[MEDIA PROXY] Full fetch URL:', djangoUrl);

    // Fetch from Django backend with a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(djangoUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Next.js-MediaProxy',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[MEDIA PROXY] Error status:', response.status, response.statusText);
      console.error('[MEDIA PROXY] Content-Type:', response.headers.get('Content-Type'));
      
      // Return 404 with helpful error message
      return NextResponse.json(
        { 
          error: 'Image not found on backend',
          path: mediaPath,
          tried_url: djangoUrl,
          status: response.status
        },
        { status: response.status }
      );
    }

    // Get the content type from Django response
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    const contentLength = response.headers.get('Content-Length');

    console.log('[MEDIA PROXY] Success - Content-Type:', contentType, 'Size:', contentLength);

    // Create a new response with proper headers
    const mediaResponse = new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
      },
    });

    return mediaResponse;
  } catch (error) {
    console.error('[MEDIA PROXY ERROR]', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy media request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
