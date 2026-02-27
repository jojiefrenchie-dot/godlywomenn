import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apiUrl = getApiUrl(`/api/messaging/messages/${id}/`, true);
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
        { error: 'Failed to fetch message' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[MESSAGING_MESSAGE_DETAIL]', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apiUrl = getApiUrl(`/api/messaging/messages/${id}/`, true);
    const authHeader = req.headers.get('authorization');

    const resp = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
    });

    if (!resp.ok && resp.status !== 204) {
      return NextResponse.json(
        { error: 'Failed to delete message' },
        { status: resp.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('[MESSAGING_MESSAGE_DELETE]', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
