'use client';

import { Typography } from '@mui/material';
import { blogApi } from '@/lib/store/blogApi';

export default function TotalPostsCount() {
  // Use RTK Query to get the latest posts data
  const { data } = blogApi.useGetBlogPostsQuery({ 
    page: 1, 
    pageSize: 1 // We only need total, so minimize data transfer
  });

  return (
    <Typography variant="subtitle1" color="text.secondary">
      Total Posts: {data?.total || 0}
    </Typography>
  );
}
