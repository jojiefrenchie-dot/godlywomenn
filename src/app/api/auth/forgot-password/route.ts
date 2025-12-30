import { NextResponse } from 'next/server';

const DJANGO_API = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const resp = await fetch(`${DJANGO_API}/api/auth/forgot-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    return NextResponse.json(json, { status: resp.status });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}