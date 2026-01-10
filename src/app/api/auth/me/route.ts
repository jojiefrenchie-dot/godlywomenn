import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function GET(req: Request) {
  try {
    const apiUrl = getApiUrl('/api/auth/me/', true);
    const authHeader = req.headers.get('authorization');

    console.log('[AUTH_ME_GET]', {
      url: apiUrl,
      hasAuth: !!authHeader,
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
      console.error('[AUTH_ME_GET] Error:', {
        status: resp.status,
        data: errData,
      });
      return NextResponse.json(
        { error: 'Failed to fetch user profile', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[AUTH_ME_GET]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const apiUrl = getApiUrl('/api/auth/me/', true);
    const authHeader = req.headers.get('authorization');

    console.log('[AUTH_ME_PATCH]', {
      url: apiUrl,
      hasAuth: !!authHeader,
    });

    const resp = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errData = await resp.text();
      console.error('[AUTH_ME_PATCH] Error:', {
        status: resp.status,
        data: errData,
      });
      return NextResponse.json(
        { error: 'Failed to update profile', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[AUTH_ME_PATCH]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const apiUrl = getApiUrl('/api/auth/me/', true);
    const authHeader = req.headers.get('authorization');

    const resp = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errData = await resp.text();
      return NextResponse.json(
        { error: 'Failed to update profile', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[AUTH_ME_PUT]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}
