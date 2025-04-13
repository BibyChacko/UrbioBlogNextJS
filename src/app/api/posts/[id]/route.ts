import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/db/posts';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Add artificial delay in development
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    return NextResponse.json(
      { error: 'Blog post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}
