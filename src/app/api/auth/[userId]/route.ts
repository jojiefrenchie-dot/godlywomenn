import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

// Reserved NextAuth route names that should not be treated as user IDs
const RESERVED_ROUTES = new Set([
  'error',
  'signin',
  'callback',
  'providers',
  'session',
  '_log',
  'me',
  'register',
  'token',
  'forgot-password',
  'reset-password',
  'upload-image',
]);

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    // Don't process reserved NextAuth routes
    if (RESERVED_ROUTES.has(userId.toLowerCase())) {
      return NextResponse.json(
        { error: 'Not a valid user ID' },
        { status: 400 }
      );
    }

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
