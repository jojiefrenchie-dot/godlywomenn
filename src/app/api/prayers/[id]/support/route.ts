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
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${DJANGO_API}/api/prayers/${params.id}/support/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Support prayer error:', response.status, data);
      throw new Error(`Failed to support prayer: ${data.message || response.statusText}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(
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
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${DJANGO_API}/api/prayers/${params.id}/support/`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Unsupport prayer error:', response.status, data);
      throw new Error(`Failed to unsupport prayer: ${data.message || response.statusText}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}
