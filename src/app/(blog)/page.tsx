import { Suspense } from 'react';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import { posts } from '@/lib/db/posts';
import BlogPosts from './BlogPosts';

// Server Component
async function getInitialPosts(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const author = searchParams.get('author') || '';

  let filteredPosts = [...posts];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
    );
  }

  if (tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags?.includes(tag));
  }

  if (author) {
    filteredPosts = filteredPosts.filter((post) => post.author === author);
  }

  // Sort posts by date in descending order
  filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = filteredPosts.slice(start, end);

  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    hasMore: end < filteredPosts.length,
  };
}

// Server Component
export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params.set(key, value);
    }
  });

  const initialData = await getInitialPosts(params);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Blog Posts
          </Typography>
        </Grid>

        <Suspense fallback={<CircularProgress />}>
          <BlogPosts initialData={initialData} />
        </Suspense>
      </Grid>
    </Container>
  );
}
