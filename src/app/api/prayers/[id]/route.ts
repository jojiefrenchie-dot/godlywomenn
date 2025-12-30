import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export async function GET(
  request: Request,
  context: any
) {
  const params = await context.params as { id: string };
  try {
    const response = await fetch(
      `${DJANGO_API}/api/prayers/${params.id}/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prayer');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}