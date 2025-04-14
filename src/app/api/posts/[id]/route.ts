import { NextResponse } from 'next/server';
import { getPost } from '@/lib/db/posts';

// Define route segment config
export const dynamic = 'force-dynamic';

// Route handler
export async function GET(
  _request: Request,
  context: any
) {
  // Simulate network delay in development
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const post = getPost(context.params.id);

  if (!post) {
    return NextResponse.json(
      { error: 'Blog post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}
