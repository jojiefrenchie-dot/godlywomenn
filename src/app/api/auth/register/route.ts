import { NextResponse } from "next/server";

const DJANGO_API = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const resp = await fetch(`${DJANGO_API}/api/auth/register/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error('Django register error:', resp.status, json);
      // Extract error message from Django response
      let message = 'Registration failed';
      if (json.email && Array.isArray(json.email)) {
        message = json.email[0];
      } else if (json.email && typeof json.email === 'string') {
        message = json.email;
      } else if (json.message) {
        message = json.message;
      } else if (json.detail) {
        message = json.detail;
      } else if (json.error) {
        message = typeof json.error === 'string' ? json.error : 'Registration failed';
      }
      return NextResponse.json({ message }, { status: resp.status });
    }

    return NextResponse.json(json, { status: 201 });
  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}