import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDjangoApiUrl } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const { status } = await request.json();
  const params = await context.params as { id: string };
    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get access token from session
    let accessToken = (session as any).accessToken;

    // If access token is not available or expired, try to refresh it
    if (!accessToken) {
      console.log('No access token found, refreshing...');
      const refreshedSession = await getServerSession(authOptions);
      accessToken = (refreshedSession as any)?.accessToken;
      
      if (!accessToken) {
        return NextResponse.json({ error: "Failed to refresh access token" }, { status: 401 });
      }
    }

    // Make request to Django API
  const response = await fetch(getDjangoApiUrl(`/api/articles/${params.id}/`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ status }),
    });

    // Handle token expired error
    if (response.status === 401) {
      console.log('Token expired, refreshing...');
      const refreshedSession = await getServerSession(authOptions);
      const newAccessToken = (refreshedSession as any)?.accessToken;
      
      if (!newAccessToken) {
        return NextResponse.json({ error: "Failed to refresh access token" }, { status: 401 });
      }

      // Retry with new token
  const retryResponse = await fetch(getDjangoApiUrl(`/api/articles/${params.id}/`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newAccessToken}`
        },
        body: JSON.stringify({ status }),
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({ error: "Failed to update article status" }));
        return NextResponse.json(error, { status: retryResponse.status });
      }

      const data = await retryResponse.json();
      return NextResponse.json(data);
    }

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