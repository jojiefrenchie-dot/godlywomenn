import { NextResponse, NextRequest } from 'next/server';
import { getBackendApiUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    try {
      const resp = await fetch(
        getBackendApiUrl(`/api/articles/${id}/comments/`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!resp.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch comments' },
          { status: resp.status }
        );
      }

      const data = await resp.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { comments: [] },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', comments: [] },
      { status: 500 }
    );
  }
}