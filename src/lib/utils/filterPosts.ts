
import { posts } from '@/lib/db/posts';

interface FilterPostsParams {
  search?: string;
  tag?: string;
  author?: string;
  page?: number;
  pageSize?: number;
}

export function filterPosts({ search, tag, author, page = 1, pageSize = 10 }: FilterPostsParams) {
  // Create a copy to avoid mutating original array
  let filteredPosts = [...posts];

  // Sort by ID in descending order (newest first since we use incrementing IDs)
  filteredPosts.sort((a, b) => {
    return parseInt(b.id) - parseInt(a.id);
  });

  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.author.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (tag) {
    const tagLower = tag.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(t => t.toLowerCase() === tagLower)
    );
  }

  if (author) {
    const authorLower = author.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.author.toLowerCase() === authorLower
    );
  }

  // Calculate pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = filteredPosts.slice(start, end);

  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    hasMore: end < filteredPosts.length,
  };
}
