import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const authHeader = (request as any).headers?.get?.('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Note: Authorization is now handled via token header, user ID validation happens in Django

    const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

    const response = await fetch(
      `${djangoApiUrl}/api/auth/${userId}/stats/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      const errorData = await response.text();
      console.error('Django API error:', {
        status: response.status,
        contentType: contentType,
        data: errorData.substring(0, 200),
      });
      if (response.status === 401) {
        // Token refresh would need to be handled by the client
        // For now, just return the 401 error
      }
      return NextResponse.json(
        { error: `Django API returned ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error('Unexpected content type from Django:', contentType);
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Backend server error - unexpected response format', details: errorData.substring(0, 200) },
        { status: 502 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response from Django');
      return NextResponse.json(
        { error: 'Backend server error - invalid response format' },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}