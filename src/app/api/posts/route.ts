import { NextRequest, NextResponse } from 'next/server';
import { filterPosts } from '@/lib/db/posts';
import { posts } from '@/lib/db/posts';
import { BlogPost } from '@/types/blog';

// Enable edge runtime for better performance
export const runtime = 'edge';

// Add cache configuration
export const revalidate = 3600; // Revalidate every hour

// Add artificial delay for development
const DELAY = 1000; // milliseconds

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '6');
  const search = searchParams.get('search') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const author = searchParams.get('author') || undefined;
  
  try {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const result = filterPosts({ search, tag, author, page, pageSize });
    
    // Set cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    console.log(result);
    return NextResponse.json(result, {
      headers,
      status: 200,
    });
  } catch (error) {
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
        { error: 'Title, content and author are required' },
        { status: 400 }
      );
    }

    // Create new post
    const newPost: BlogPost = {
      id: (posts.length + 1).toString(),
      title: body.title,
      content: body.content,
      author: body.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: body.imageUrl || 'https://dummyimage.com/640x480/',
      tags: body.tags || [],
    };

    // Add to posts array
    posts.unshift(newPost);

    await new Promise(resolve => setTimeout(resolve, DELAY));
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
