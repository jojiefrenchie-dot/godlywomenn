import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const apiUrl = getApiUrl(`/api/auth/${userId}/`, true);

    console.log('[USER_DETAIL]', {
      url: apiUrl,
      userId,
    });

    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!resp.ok) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[USER_DETAIL]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}
