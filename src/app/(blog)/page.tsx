import { Suspense } from 'react';
import { Container, Grid, Typography, CircularProgress, Box } from '@mui/material';
import BlogPosts from './BlogPosts';
import { blogApi } from '@/lib/store/blogApi';
import { store } from '@/lib/store/store';
import { filterPosts } from '@/lib/utils/filterPosts';
import TotalPostsCount from '@/components/blog/TotalPostsCount';

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

// Server Component
export default async function BlogPage({ searchParams }: PageProps) {
  // Wait for searchParams to be ready
  const resolvedParams = await searchParams;

  // Handle params safely - don't include page in initial load
  const pageSize = typeof resolvedParams.pageSize === 'string' ? parseInt(resolvedParams.pageSize) : 10;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const tag = typeof resolvedParams.tag === 'string' ? resolvedParams.tag : '';
  const author = typeof resolvedParams.author === 'string' ? resolvedParams.author : '';

  // Get initial posts for SSR
  const { total: initialTotal } = filterPosts({ search, tag, author });

  try {
    // Prefetch initial data on server
    await store.dispatch(
      blogApi.util.prefetch('getBlogPosts', { page: 1, pageSize, search, tag, author }, { force: true })
    );
  } catch (error) {
    console.error('Error prefetching data:', error);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Blog Posts
            </Typography>
            <Suspense fallback={
              <Typography variant="subtitle1" color="text.secondary">
                Total Posts: {initialTotal}
              </Typography>
            }>
              <TotalPostsCount />
            </Suspense>
          </Box>
        </Grid>

        <Suspense fallback={<CircularProgress />}>
          <BlogPosts initialPage={1} />
        </Suspense>
      </Grid>
    </Container>
  );
}
