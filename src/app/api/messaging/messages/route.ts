import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function GET(req: Request) {
  try {
    const apiUrl = getApiUrl('/api/messaging/messages/', true);
    const authHeader = req.headers.get('authorization');

    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
    });

    if (!resp.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[MESSAGING_MESSAGES]', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const apiUrl = getApiUrl('/api/messaging/messages/', true);
    const authHeader = req.headers.get('authorization');
    const contentType = req.headers.get('content-type') || '';

    console.log('[MESSAGING_MESSAGES_POST]', {
      url: apiUrl,
      contentType,
      hasAuth: !!authHeader,
    });

    let body: any;
    
    // Handle both FormData and JSON
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('multipart/form-data')) {
      // For FormData, pass it through directly
      body = await req.formData();
    } else {
      body = await req.json();
    }

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        // Don't set Content-Type for FormData - let fetch set it with boundary
        ...(!(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    if (!resp.ok) {
      const errData = await resp.text();
      console.error('[MESSAGING_MESSAGES_POST] Error:', {
        status: resp.status,
        data: errData,
      });
      return NextResponse.json(
        { error: 'Failed to send message', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[MESSAGING_MESSAGES_POST]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

