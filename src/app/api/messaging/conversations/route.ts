import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function GET(req: Request) {
  try {
    const apiUrl = getApiUrl('/api/messaging/conversations/', true);
    const authHeader = req.headers.get('authorization');

    console.log('[MESSAGING_CONVERSATIONS_GET]', {
      url: apiUrl,
      hasAuth: !!authHeader,
      authPrefix: authHeader?.substring(0, 20),
    });

    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
    });

    if (!resp.ok) {
      const errData = await resp.text();
      console.error('[MESSAGING_CONVERSATIONS_GET] Error:', {
        status: resp.status,
        data: errData,
      });
      return NextResponse.json(
        { error: 'Failed to fetch conversations', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[MESSAGING_CONVERSATIONS]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiUrl = getApiUrl('/api/messaging/conversations/', true);
    const authHeader = req.headers.get('authorization');

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[MESSAGING_CONVERSATIONS_POST]', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
