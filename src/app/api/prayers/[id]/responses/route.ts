import { NextResponse } from 'next/server';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

export async function POST(
  request: Request,
  context: any
) {
  const params = await context.params as { id: string };
  const authHeader = (request as any).headers?.get?.('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(
      `${DJANGO_API}/api/prayers/${params.id}/respond/`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Create response error:', response.status, data);
      // Format error message - handle both object and string errors
      let errorMessage = 'Failed to create response';
      if (typeof data === 'object') {
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.details) {
          errorMessage = data.details;
        } else {
          // Handle validation errors like { prayer: ['This field is required.'] }
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errorMessage = data[firstKey][0];
          } else if (firstKey && typeof data[firstKey] === 'string') {
            errorMessage = data[firstKey];
          }
        }
      }
      return NextResponse.json(
        { error: errorMessage, status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}