import { NextResponse, NextRequest } from 'next/server';

import { getBackendApiUrl } from '@/lib/api';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pk: string }> }
) {
  try {
    const { pk } = await params;
    
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const djangoUrl = getBackendApiUrl(`/api/articles/comment/${pk}/delete/`);
    
    const resp = await fetch(djangoUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // 204 No Content has no response body - return immediately
    if (resp.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // For other status codes, try to parse JSON
    try {
      const data = await resp.json();
      return NextResponse.json(data, { status: resp.status });
    } catch {
      // If we can't parse JSON, just return the status
      return new NextResponse(null, { status: resp.status });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
