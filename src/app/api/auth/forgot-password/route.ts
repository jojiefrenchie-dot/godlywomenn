import { NextResponse } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[FORGOT_PASSWORD] Processing request for email:', body.email);

    const resp = await fetch(`${DJANGO_API}/api/auth/forgot-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('[FORGOT_PASSWORD] Response status:', resp.status);
    console.log('[FORGOT_PASSWORD] Response content-type:', resp.headers.get('content-type'));

    // Check content type first
    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const errorText = await resp.text();
      console.error('[FORGOT_PASSWORD] Unexpected content type. Response preview:', errorText.substring(0, 200));
      return NextResponse.json(
        { message: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    let json;
    try {
      json = await resp.json();
    } catch (e) {
      console.error('[FORGOT_PASSWORD] Failed to parse JSON response', e);
      return NextResponse.json(
        { message: 'Backend server error - invalid response format' },
        { status: 502 }
      );
    }

    return NextResponse.json(json, { status: resp.status });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[FORGOT_PASSWORD] Error:', error);
    console.error('[FORGOT_PASSWORD] Error details:', errorMsg);
    return NextResponse.json({ message: `Error processing request: ${errorMsg}` }, { status: 500 });
  }
}

