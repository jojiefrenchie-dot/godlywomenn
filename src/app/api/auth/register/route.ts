import { NextResponse } from "next/server";

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[REGISTER] Attempting registration for:', body.email);
    console.log('[REGISTER] Calling Django API at:', `${DJANGO_API}/api/auth/register/`);

    const resp = await fetch(`${DJANGO_API}/api/auth/register/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('[REGISTER] Response status:', resp.status);
    console.log('[REGISTER] Response content-type:', resp.headers.get('content-type'));
    
    // Try to parse response as JSON
    let json;
    const contentType = resp.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        json = await resp.json();
      } catch (e) {
        const text = await resp.text();
        console.error('[REGISTER] Failed to parse JSON response:', text.substring(0, 200));
        return NextResponse.json(
          { message: 'Backend server error - invalid response format' },
          { status: 502 }
        );
      }
    } else {
      const text = await resp.text();
      console.error('[REGISTER] Unexpected content type. Response:', text.substring(0, 200));
      return NextResponse.json(
        { message: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }
    
    if (!resp.ok) {
      console.error('Django register error:', resp.status, json);
      let message = 'Registration failed';
      
      if (json.errors && typeof json.errors === 'object') {
        const firstField = Object.keys(json.errors)[0];
        const firstError = json.errors[firstField];
        if (Array.isArray(firstError) && firstError.length > 0) {
          message = firstError[0];
        } else if (typeof firstError === 'string') {
          message = firstError;
        }
      } else if (json.email && Array.isArray(json.email)) {
        message = json.email[0];
      } else if (json.email && typeof json.email === 'string') {
        message = json.email;
      } else if (json.password && Array.isArray(json.password)) {
        message = json.password[0];
      } else if (json.password && typeof json.password === 'string') {
        message = json.password;
      } else if (json.message) {
        message = json.message;
      } else if (json.detail) {
        message = json.detail;
      } else if (json.error) {
        message = typeof json.error === 'string' ? json.error : 'Registration failed';
      }
      console.error('[REGISTER] Extracted error message:', message);
      return NextResponse.json({ message }, { status: resp.status });
    }

    return NextResponse.json(json, { status: 201 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[REGISTRATION_ERROR]', error);
    console.error('[REGISTRATION_ERROR] Details:', errorMsg);
    return NextResponse.json({ message: `Server error: ${errorMsg}` }, { status: 500 });
  }
}