import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiUrl = getApiUrl('/api/messaging/conversations/start_conversation/', true);
    const authHeader = req.headers.get('authorization');

    console.log('[MESSAGING_START_CONVERSATION]', {
      url: apiUrl,
      userId: body.user_id,
      hasAuth: !!authHeader,
    });

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
      const errData = await resp.text();
      console.error('[MESSAGING_START_CONVERSATION] Error:', {
        status: resp.status,
        data: errData,
      });
      return NextResponse.json(
        { error: 'Failed to start conversation', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[MESSAGING_START_CONVERSATION]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

