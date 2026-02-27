import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  context: any
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization') || '';
    const accessToken = authHeader.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();
    const params = await context.params as { id: string };
    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Make request to Django API
    const response = await fetch(getBackendApiUrl(`/api/articles/${params.id}/`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ status }),
    });

    // Handle other errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to update article status" }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating article status:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}