import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || "https://godlywomenn.onrender.com";
const NEXT_API = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function readDefaultCategories() {
  try {
    const p = path.join(process.cwd(), 'src', 'data', 'default-categories.json');
    const txt = await fs.readFile(p, 'utf-8');
    const data = JSON.parse(txt);
    return data;
  } catch (e) {
    console.error('Failed to read default categories file:', e);
    return [];
  }
}

export async function GET() {
  try {
    // Prevent recursive calls: if DJANGO_API and NEXT_API point to same origin, fall back to local default file
    let djangoOrigin = '';
    let nextOrigin = '';
    try {
      djangoOrigin = new URL(String(DJANGO_API)).origin;
    } catch (e) {
      djangoOrigin = String(DJANGO_API).replace(/\/$/, '');
    }
    try {
      nextOrigin = new URL(String(NEXT_API)).origin;
    } catch (e) {
      nextOrigin = String(NEXT_API).replace(/\/$/, '');
    }

    if (djangoOrigin === nextOrigin) {
      console.warn('DJANGO_API appears to point to the same origin as NEXT_API â€” using default categories to avoid recursive proxy');
      const fallback = await readDefaultCategories();
      return NextResponse.json(fallback, { status: 200, headers: { 'X-Categories-Fallback': 'true' } });
    }

    // For public GET requests, directly proxy to Django without requiring auth
    const response = await fetch(`${DJANGO_API}/api/categories/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Django categories error:', response.status, errorText);
      // If Django is down, return default categories
      const fallback = await readDefaultCategories();
      return NextResponse.json(fallback, { status: 200, headers: { 'X-Categories-Fallback': 'true' } });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in categories GET route:', error);
    const fallback = await readDefaultCategories();
    return NextResponse.json(fallback, { status: 200, headers: { 'X-Categories-Fallback': 'true' } });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = (request as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!token || token.length <= 10) {
      console.error('Authorization token is missing or invalid');
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const resp = await fetch(`${DJANGO_API}/api/categories/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error('Django create category error', resp.status, json);
      // Format validation errors nicely
      if (resp.status === 400 && typeof json === 'object') {
        const errors = Object.entries(json)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
        return NextResponse.json({ error: errors }, { status: 400 });
      }
      return NextResponse.json({ error: json.detail || 'Failed to create category' }, { status: resp.status });
    }

    return NextResponse.json(json, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

