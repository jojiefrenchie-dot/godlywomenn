import { NextRequest } from "next/server";

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function PATCH(
  request: NextRequest,
  context: any
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization') || '';
    const accessToken = authHeader.replace('Bearer ', '');

    if (!accessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { status } = await request.json();
    const params = await context.params as { id: string };
    if (!status || !['draft', 'published'].includes(status)) {
      return new Response("Invalid status", { status: 400 });
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