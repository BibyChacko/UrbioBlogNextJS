'use client';

import { useCallback, useState, useEffect } from 'react';
import { Grid, Alert, CircularProgress, Box, Button, Fade } from '@mui/material';
import BlogCard from '@/components/blog/BlogCard';
import SearchFilters from './SearchFilters';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { blogApi } from '@/lib/store/blogApi';
import type { BlogPost } from '@/types/blog';

interface BlogPostsProps {
  initialPage: number;
}

export default function BlogPosts({ initialPage }: BlogPostsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const pageSize = 10;

  // Create URLSearchParams object for better params handling
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  const search = currentParams.get('search') || undefined;
  const tag = currentParams.get('tag') || undefined;
  const author = currentParams.get('author') || undefined;

  const { data, isLoading, isFetching, error } = blogApi.useGetBlogPostsQuery({
    page: currentPage,
    pageSize,
    search,
    tag,
    author
  });

  // Update accumulated posts when data changes
  useEffect(() => {
    if (data?.posts) {
      if (currentPage === 1) {
        // Reset posts if it's the first page
        setAllPosts(data.posts);
      } else {
        // Append new posts to existing ones, avoiding duplicates
        setAllPosts(prevPosts => {
          const newPosts = data.posts.filter(
            newPost => !prevPosts.some(existingPost => existingPost.id === newPost.id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [data?.posts, currentPage]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && data?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [isFetching, data?.hasMore]);

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
    
    // Reset page and accumulated posts when search params change
    setCurrentPage(1);
    setAllPosts([]);
    
    // Update URL without reload, but don't include page
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [pathname, router, currentParams]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!data && allPosts.length === 0) {
    return null;
  }

  const uniqueTags = Array.from(
    new Set(allPosts.map((post: BlogPost) => post.tags || []).flat())
  ).sort();

  const uniqueAuthors = Array.from(
    new Set(allPosts.map((post: BlogPost) => post.author))
  ).sort();

  return (
    <>
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
          {allPosts.map((post: BlogPost, index: number) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={`${post.id}-${index}`}
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

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        {!isLoading && !isFetching && (
          data?.hasMore ? (
            <Button variant="outlined" onClick={handleLoadMore}>
              Load More
            </Button>
          ) : allPosts.length > pageSize && (
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

      <Fade in={allPosts.length > pageSize && window.scrollY > 500}>
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
    </>
  );
}
