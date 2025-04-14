import { NextRequest, NextResponse } from 'next/server';
import { posts, addPost } from '@/lib/db/posts';
import { filterPosts } from '@/lib/utils/filterPosts';
import { BlogPost } from '@/types/blog';

// Enable edge runtime for better performance
export const runtime = 'edge';

const DELAY = process.env.NODE_ENV === 'development' ? 1000 : 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const author = searchParams.get('author') || undefined;
    
    // Add artificial delay in development
    if (DELAY) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }

    const result = filterPosts({ search, tag, author, page, pageSize });
    
    // Set cache headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get highest ID and increment
    const highestId = Math.max(...posts.map(post => parseInt(post.id)), 0);
    
    // Create timestamp for both created and updated
    const now = new Date().toISOString();
    
    // Create new post
    const newPost: BlogPost = {
      id: (highestId + 1).toString(),
      title: body.title,
      content: body.content,
      author: body.author,
      tags: body.tags || [],
      imageUrl: body.imageUrl || 'https://dummyimage.com/640x480/',
      createdAt: now,
      updatedAt: now,
    };

    // Add to posts using singleton store method
    addPost(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
