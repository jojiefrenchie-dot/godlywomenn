import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export async function PATCH(
  request: NextRequest,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

  const { status } = await request.json();
  const params = await context.params as { id: string };
    if (!status || !['draft', 'published'].includes(status)) {
      return new Response("Invalid status", { status: 400 });
    }

    // Get fresh session to ensure token is valid
    const freshSession = await getServerSession(authOptions);
    const accessToken = (freshSession as any)?.accessToken;

    if (!accessToken) {
      return new Response("Session expired", { status: 401 });
    }

  const response = await fetch(`${DJANGO_API}/api/articles/${params.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return new Response(
        JSON.stringify(errorData || { detail: 'Failed to update article status' }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error updating article status:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}