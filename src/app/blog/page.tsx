'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Grid, Typography, Alert, CircularProgress, Box, Button, Fade } from '@mui/material';
import BlogCard from '@/components/blog/BlogCard';
import SearchFilters from './SearchFilters';
import { blogApi } from '@/lib/store/blogApi';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  // Create URLSearchParams object for better params handling
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  const search = currentParams.get('search') || undefined;
  const tag = currentParams.get('tag') || undefined;
  const author = currentParams.get('author') || undefined;

  const {
    data: blogData,
    isLoading,
    isFetching,
    error,
    refetch
  } = blogApi.useGetBlogPostsQuery({
    page,
    pageSize,
    search,
    tag,
    author,
  }, {
    // Enable cache persistence
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    refetchOnFocus: false
  });

  // Reset page when search params change
  useEffect(() => {
    setPage(1);
    setPosts([]);
    refetch();
  }, [search, tag, author, refetch]);

  // Update posts when data changes
  useEffect(() => {
    if (blogData?.posts) {
      setPosts(prevPosts => {
        if (page === 1) return blogData.posts;
        return [...prevPosts, ...blogData.posts];
      });

      // Scroll to the last post of the previous page
      if (page > 1 && lastPostRef.current) {
        const yOffset = -80;
        const element = lastPostRef.current;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [blogData, page]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && blogData?.hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, blogData?.hasMore]);

  const handleSearch = useCallback((params: { search?: string; tag?: string; author?: string }) => {
    const newParams = new URLSearchParams(currentParams);
    
    // Update search params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset page param
    newParams.delete('page');
    
    // Update URL without reload
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [pathname, router, currentParams]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique tags and authors for filters
  const uniqueTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).sort();

  const uniqueAuthors = Array.from(
    new Set(posts.map(post => post.author))
  ).sort();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Blog Posts
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <SearchFilters 
            onSearch={handleSearch}
            availableTags={uniqueTags}
            availableAuthors={uniqueAuthors}
          />
        </Grid>

        {error ? (
          <Grid item xs={12}>
            <Alert severity="error">
              Failed to load posts. Please try again later.
            </Alert>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <Grid container spacing={3}>
            {posts.map((post, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${post.id}-${index}`}
                ref={index === posts.length - pageSize ? lastPostRef : undefined}
              >
                <BlogCard post={post} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {(isLoading || isFetching) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Grid>
        )}

        <Grid item xs={12} ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          {!isLoading && !isFetching && (
            blogData?.hasMore ? (
              <Button variant="outlined" onClick={handleLoadMore}>
                Load More
              </Button>
            ) : posts.length > pageSize && (
              <Button
                variant="outlined"
                onClick={scrollToTop}
                startIcon={<KeyboardArrowUpIcon />}
              >
                Scroll to Top
              </Button>
            )
          )}
        </Grid>

        <Fade in={posts.length > pageSize && window.scrollY > 500}>
          <Box
            onClick={scrollToTop}
            role="presentation"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: 'auto', width: 40, height: 40, borderRadius: '50%' }}
            >
              <KeyboardArrowUpIcon />
            </Button>
          </Box>
        </Fade>
      </Grid>
    </Container>
  );
}
