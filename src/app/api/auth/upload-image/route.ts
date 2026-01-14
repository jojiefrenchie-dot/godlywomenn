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
      const errData = await resp.text();
      console.error('[AUTH_UPLOAD_IMAGE_POST] Error:', {
        status: resp.status,
        data: errData,
      });
      return NextResponse.json(
        { error: 'Failed to upload image', details: errData },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    console.log('[AUTH_UPLOAD_IMAGE_POST] ✓ Image uploaded:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[AUTH_UPLOAD_IMAGE_POST]', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}
