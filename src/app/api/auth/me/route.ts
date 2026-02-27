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

    // Check content type first
    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const errData = await resp.text();
      console.error('[AUTH_ME_GET] Unexpected content type:', contentType, 'Preview:', errData.substring(0, 200));
      return NextResponse.json(
        { error: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    if (!resp.ok) {
      let errData;
      try {
        errData = await resp.json();
      } catch (e) {
        console.error('[AUTH_ME_GET] Failed to parse error JSON');
        return NextResponse.json(
          { error: 'Backend server error - invalid response format' },
          { status: 502 }
        );
      }
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
      const contentType = resp.headers.get('content-type') || '';
      const errData = await resp.text();
      console.error('[AUTH_ME_PATCH] Error:', {
        status: resp.status,
        contentType: contentType,
        data: errData.substring(0, 200),
      });
      
      if (contentType.includes('application/json')) {
        try {
          const jsonError = JSON.parse(errData);
          return NextResponse.json(
            { error: 'Failed to update profile', details: jsonError },
            { status: resp.status }
          );
        } catch (e) {
          // Fall through to text response
        }
      }
      
      return NextResponse.json(
        { error: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error('[AUTH_ME_PATCH] Unexpected content type for success response:', contentType);
      return NextResponse.json(
        { error: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    let data;
    try {
      data = await resp.json();
    } catch (e) {
      console.error('[AUTH_ME_PATCH] Failed to parse JSON response');
      return NextResponse.json(
        { error: 'Backend server error - invalid response format' },
        { status: 502 }
      );
    }

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
      const contentType = resp.headers.get('content-type') || '';
      const errData = await resp.text();
      console.error('[AUTH_ME_PUT] Error:', {
        status: resp.status,
        contentType: contentType,
        data: errData.substring(0, 200),
      });
      
      if (contentType.includes('application/json')) {
        try {
          const jsonError = JSON.parse(errData);
          return NextResponse.json(
            { error: 'Failed to update profile', details: jsonError },
            { status: resp.status }
          );
        } catch (e) {
          // Fall through to error response
        }
      }

      return NextResponse.json(
        { error: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error('[AUTH_ME_PUT] Unexpected content type for success response:', contentType);
      return NextResponse.json(
        { error: 'Backend server error - unexpected response format' },
        { status: 502 }
      );
    }

    let data;
    try {
      data = await resp.json();
    } catch (e) {
      console.error('[AUTH_ME_PUT] Failed to parse JSON response');
      return NextResponse.json(
        { error: 'Backend server error - invalid response format' },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[AUTH_ME_PUT]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

