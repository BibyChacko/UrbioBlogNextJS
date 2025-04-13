import { NextRequest, NextResponse } from 'next/server';
import { filterPosts } from '@/lib/db/posts';

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
