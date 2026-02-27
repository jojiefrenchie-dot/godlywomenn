import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const authHeader = (req as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    // Forward the request to Django
    const response = await fetch(getBackendApiUrl('/api/articles/upload-image/'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Forward the form data as is
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

