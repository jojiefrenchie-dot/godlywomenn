import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apiUrl = getApiUrl(`/api/messaging/conversations/${id}/`, true);
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
        { error: 'Failed to fetch conversation' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[MESSAGING_CONVERSATION_DETAIL]', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    // Check if this is a mark_as_read request
    const action = req.url.includes('mark_as_read') ? 'mark_as_read' : 'unknown';
    const apiUrl = getApiUrl(`/api/messaging/conversations/${id}/${action}/`, true);
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
        { error: 'Failed to update conversation' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[MESSAGING_CONVERSATION_ACTION]', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
