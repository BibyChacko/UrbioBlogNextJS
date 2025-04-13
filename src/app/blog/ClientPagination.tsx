'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { BlogPostsResponse } from '@/types/blog';

interface ClientPaginationProps {
  initialData: BlogPostsResponse;
  pageSize: number;
}

export default function ClientPagination({ initialData, pageSize }: ClientPaginationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const response = await fetch(`/api/posts?page=${nextPage}&pageSize=${pageSize}`);
      const data: BlogPostsResponse = await response.json();
      
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMore) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={loadMore}
          size="large"
        >
          Load More
        </Button>
      )}
    </Box>
  );
}
