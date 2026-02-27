import { NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/api-url';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const authHeader = req.headers.get('authorization');

    console.log('[AUTH_UPLOAD_IMAGE_POST]', {
      hasAuth: !!authHeader,
      hasFile: formData.has('image'),
    });

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl('/api/auth/upload-image/', true);

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: formData,
    });

    if (!resp.ok) {
      const contentType = resp.headers.get('content-type') || '';
      const errData = await resp.text();
      console.error('[AUTH_UPLOAD_IMAGE_POST] Error:', {
        status: resp.status,
        contentType: contentType,
        data: errData.substring(0, 200),
      });
      return NextResponse.json(
        { error: 'Failed to upload image', details: errData },
        { status: resp.status }
      );
    }

    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error('[AUTH_UPLOAD_IMAGE_POST] Unexpected content type:', contentType);
      const errData = await resp.text();
      return NextResponse.json(
        { error: 'Backend server error - unexpected response format', details: errData.substring(0, 200) },
        { status: 502 }
      );
    }

    let data;
    try {
      data = await resp.json();
    } catch (e) {
      console.error('[AUTH_UPLOAD_IMAGE_POST] Failed to parse JSON response');
      return NextResponse.json(
        { error: 'Backend server error - invalid response format' },
        { status: 502 }
      );
    }

    console.log('[AUTH_UPLOAD_IMAGE_POST] âœ“ Image uploaded:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[AUTH_UPLOAD_IMAGE_POST]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}

