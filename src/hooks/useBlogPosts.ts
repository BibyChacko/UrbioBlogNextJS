'use client';

import { useState, useEffect } from 'react';
import { BlogPostsResponse, BlogPostsQuery } from '@/types/blog';

export function useBlogPosts(initialQuery: BlogPostsQuery) {
  const [data, setData] = useState<BlogPostsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<BlogPostsQuery>(initialQuery);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams({
          page: query.page.toString(),
          pageSize: query.pageSize.toString(),
        });
        
        if (query.tag) searchParams.append('tag', query.tag);
        if (query.search) searchParams.append('search', query.search);

        const response = await fetch(`/api/posts?${searchParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  const loadMore = () => {
    if (data?.hasMore) {
      setQuery(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  return {
    posts: data?.posts ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    hasMore: data?.hasMore ?? false,
    loadMore,
    setQuery,
  };
}
