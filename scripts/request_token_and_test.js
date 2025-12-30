const fetch = global.fetch || require('node-fetch');

const email = process.env.TEST_EMAIL || 'testbot+1@example.com';
const password = process.env.TEST_PW || 'TestPass123!';

async function getToken() {
  const url = 'http://localhost:8000/api/auth/token/';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    console.log('token response status', res.status);
    console.log(JSON.stringify(json, null, 2));
    if (json.access) return json.access;
    return null;
  } catch (err) {
    console.error('token request failed', err.message || err);
    return null;
  }
}

(async function() {
  const token = await getToken();
  if (!token) return process.exit(1);
  // Perform the create article POSTs with the received token
  const nextUrl = 'http://localhost:3000/api/articles';
  const djangoUrl = 'http://localhost:8000/api/articles/';

  // Fetch categories to get a valid category_id
  let categoryId = null;
  try {
    const catsRes = await fetch('http://localhost:8000/api/categories/', { headers: { 'Authorization': `Bearer ${token}` } });
    if (catsRes.ok) {
      const cats = await catsRes.json();
      if (Array.isArray(cats) && cats.length > 0) categoryId = cats[0].id;
    }
  } catch (e) {
    console.warn('Could not fetch categories:', e.message || e);
  }

  const payload = {
    title: 'Test article from script (auth)',
    excerpt: 'Script-created excerpt',
    content: 'This is a test body for verifying authenticated article creation flow.',
    category_id: categoryId,
    status: 'draft'
  };

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  console.log('Trying Next.js API route (with token):', nextUrl);
  try {
    const res = await fetch(nextUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
    const text = await res.text();
    console.log('[Next.js] status:', res.status);
    console.log('[Next.js] body:', text);
  } catch (err) {
    console.error('[Next.js] request failed', err.message || err);
  }

  console.log('\nTrying Django endpoint directly (with token):', djangoUrl);
  try {
    const res2 = await fetch(djangoUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
    const text2 = await res2.text();
    console.log('[Django] status:', res2.status);
    console.log('[Django] body:', text2);
  } catch (err) {
    console.error('[Django] request failed', err.message || err);
  }
})();
