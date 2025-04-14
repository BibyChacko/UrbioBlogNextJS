import { NextResponse } from 'next/server';
import { store } from '@/lib/store/store';
import { blogApi } from '@/lib/store/blogApi';

// Define route segment config
export const dynamic = 'force-dynamic';

// Route handler
export async function GET(
  _request: Request,
  context: any
) {
  try {
    // Simulate network delay in development
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Get post from RTK Query store
    const { data } = await store.dispatch(
      blogApi.endpoints.getBlogPosts.initiate({})
    );

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    const post = data.posts.find(p => p.id === context.params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
