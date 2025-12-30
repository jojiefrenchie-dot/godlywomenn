// Simple script to attempt article creation via Next.js API route, falling back to Django
// Run with: node scripts/test_create_article.js

const fetch = global.fetch || require('node-fetch');

// Reads AUTH_TOKEN from env and includes as Bearer if present. Useful for testing authenticated flows.
async function tryCreate() {
  const nextUrl = 'http://localhost:3000/api/articles';
  const djangoUrl = 'http://localhost:8000/api/articles/';

  const token = process.env.AUTH_TOKEN || null;

  // Minimal test payload
  const payload = {
    title: 'Test article from script',
    excerpt: 'Script-created excerpt',
    body: 'This is a test body for verifying article creation flow.',
    status: 'draft'
  };

  const baseHeaders = { 'Content-Type': 'application/json' };
  if (token) baseHeaders['Authorization'] = `Bearer ${token}`;

  console.log('Trying Next.js API route:', nextUrl, token ? '(with AUTH_TOKEN)' : '(no token)');
  try {
    const res = await fetch(nextUrl, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log('[Next.js] status:', res.status);
    console.log('[Next.js] headers:', Object.fromEntries(res.headers.entries ? res.headers.entries() : res.headers));
    console.log('[Next.js] body:', text);
  } catch (err) {
    console.log('[Next.js] request failed:', err.message || err);
  }

  console.log('\nTrying Django endpoint directly:', djangoUrl, token ? '(with AUTH_TOKEN)' : '(no token)');
  try {
    const res2 = await fetch(djangoUrl, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(payload),
    });
    const text2 = await res2.text();
    console.log('[Django] status:', res2.status);
    console.log('[Django] headers:', Object.fromEntries(res2.headers.entries ? res2.headers.entries() : res2.headers));
    console.log('[Django] body:', text2);
  } catch (err) {
    console.log('[Django] request failed:', err.message || err);
  }
}

tryCreate().catch(e => console.error('fatal:', e));
