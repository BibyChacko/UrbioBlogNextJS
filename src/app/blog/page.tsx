'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Grid, Typography, Alert, CircularProgress, Box, Button, Fade } from '@mui/material';
import BlogCard from '@/components/blog/BlogCard';
import SearchFilters from './SearchFilters';
import NewBlogPostForm from '@/components/blog/NewBlogPostForm';
import { blogApi } from '@/lib/store/blogApi';
import { useSearchParams } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  const {
    data: blogData,
    isLoading,
    isFetching,
    error,
  } = blogApi.useGetBlogPostsQuery({
    page,
    pageSize,
    search: searchParams.get('search') || undefined,
    tag: searchParams.get('tag') || undefined,
    author: searchParams.get('author') || undefined,
  });

  // Update posts when data changes
  useEffect(() => {
    setPosts(prevPosts => {
      if (page === 1) return blogData?.posts || [];
      return [...prevPosts, ...(blogData?.posts || [])];
    });

    // Scroll to the last post of the previous page
    if (page > 1 && lastPostRef.current) {
      const yOffset = -80; // Offset for fixed header if any
      const element = lastPostRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, [blogData?.posts, page]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setPosts([]);
  }, [searchParams]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && blogData?.hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, blogData?.hasMore]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get unique tags and authors for filters
  const uniqueTags = Array.from(
    new Set(posts.flatMap(post => post.tags) || [])
  ).sort();

  const uniqueAuthors = Array.from(
    new Set(posts.map(post => post.author) || [])
  ).sort();

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" variant="filled">
          Failed to load blog posts. Please try again later.
        </Alert>
      </Container>
    );
  }

  const showLoadingSpinner = isLoading && page === 1;
  const showNoPosts = posts.length === 0 && !isLoading;
  const showLoadMore = blogData?.hasMore && !isLoading;
  const showScrollToTop = !showLoadMore && posts.length > pageSize;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Blog Posts
        </Typography>
        <NewBlogPostForm />
      </Box>

      <SearchFilters
        availableTags={uniqueTags}
        availableAuthors={uniqueAuthors}
      />

      {showLoadingSpinner ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          <Fade in={true} timeout={500}>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {posts.map((post: BlogPost, index: number) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={`${post.id}-${page}-${index}`}
                  ref={index === posts.length - pageSize ? lastPostRef : undefined}
                >
                  <BlogCard post={post} />
                </Grid>
              ))}
            </Grid>
          </Fade>

          {showNoPosts && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No blog posts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}

          <Box
            ref={loadMoreRef}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 4,
              mt: 2,
            }}
          >
            {showLoadMore ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
                disabled={isFetching}
                size="large"
                sx={{
                  minWidth: 200,
                  py: 1.5,
                  position: 'relative',
                  '&:disabled': {
                    backgroundColor: 'primary.main',
                    opacity: 0.7,
                  },
                }}
              >
                {isFetching ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{
                        color: 'inherit',
                        position: 'absolute',
                        left: 20,
                      }}
                    />
                    Loading more posts...
                  </>
                ) : (
                  'Load More Posts'
                )}
              </Button>
            ) : showScrollToTop ? (
              <Fade in={true}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleScrollToTop}
                  size="large"
                  startIcon={<KeyboardArrowUpIcon />}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                  }}
                >
                  Scroll to Top
                </Button>
              </Fade>
            ) : null}
          </Box>
        </>
      )}
    </Container>
  );
}
