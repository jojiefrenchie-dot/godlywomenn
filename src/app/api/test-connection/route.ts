const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';
const NEXT_API = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET() {
  try {
    // Test the health endpoint
    const healthUrl = `${DJANGO_API}/health/`;
    const resp = await fetch(healthUrl);
    
    // Also test articles endpoint
    let articlesData = null;
    let articlesError = null;
    try {
      const articlesResp = await fetch(`${DJANGO_API}/api/articles/`);
      if (articlesResp.ok) {
        articlesData = await articlesResp.json();
      } else {
        articlesError = `Status ${articlesResp.status}`;
      }
    } catch (e) {
      articlesError = String(e);
    }
    
    if (!resp.ok) {
      console.error('Backend health check failed:', resp.status);
      return new Response(JSON.stringify({ 
        error: 'Failed to connect to backend', 
        status: resp.status, 
        url: healthUrl,
        django_api: DJANGO_API,
        next_api: NEXT_API,
        articles: { error: articlesError, data: articlesData }
      }), { status: 500 });
    }
    
    const json = await resp.json();
    return new Response(JSON.stringify({ 
      status: 'Connected successfully', 
      data: json, 
      api_url: DJANGO_API,
      next_api: NEXT_API,
      articles: { error: articlesError, data: articlesData, count: articlesData?.length || 0 }
    }), { status: 200 });
  } catch (err) {
    console.error('Backend connection error:', err);
    return new Response(JSON.stringify({ 
      error: 'Failed to connect to backend', 
      details: String(err), 
      api_url: DJANGO_API,
      next_api: NEXT_API
    }), { status: 500 });
  }
}