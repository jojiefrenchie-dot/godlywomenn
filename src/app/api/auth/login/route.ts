import { NextResponse } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Call Django login endpoint
    console.log(`[LOGIN] Attempting login for ${email}`);
    console.log(`[LOGIN] Calling Django API at: ${DJANGO_API}/api/auth/login/`);
    
    const response = await fetch(`${DJANGO_API}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log(`[LOGIN] Response status: ${response.status}`);
    console.log(`[LOGIN] Response content-type: ${response.headers.get('content-type')}`);

    // Check content type first
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const errorText = await response.text();
      console.error(`[LOGIN] Unexpected content type. Response preview:`, errorText.substring(0, 200));
      return NextResponse.json(
        { message: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      let error: any;
      try {
        error = await response.json();
      } catch (e) {
        console.error(`[LOGIN] Failed to parse error JSON`);
        return NextResponse.json(
          { message: 'Backend server error - invalid error response' },
          { status: 502 }
        );
      }
      console.error(`[LOGIN] Error response: ${JSON.stringify(error)}`);
      return NextResponse.json(
        { message: error.message || error.detail || 'Login failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[LOGIN] Success for ${email}`);

    return NextResponse.json({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[LOGIN] Error details:', errorMsg);
    return NextResponse.json({ message: `Server error: ${errorMsg}` }, { status: 500 });
  }
}
