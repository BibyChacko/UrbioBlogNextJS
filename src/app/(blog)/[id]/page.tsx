'use client';

import { useParams } from 'next/navigation';
import { Container, Typography, Box, Chip, Skeleton, Alert } from '@mui/material';
import { blogApi } from '@/lib/store/blogApi';
import 'react-quill/dist/quill.snow.css';

export default function BlogPostPage() {
  const { id } = useParams();
  const { data: post, isLoading, error } = blogApi.useGetBlogPostQuery(id as string);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={24} width="30%" sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load blog post</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Blog post not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {post.title}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>

      {post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '500px',
            objectFit: 'cover',
            borderRadius: 1,
            mb: 4,
          }}
        />
      )}

      <Box
        className="ql-editor"
        sx={{
          '& .ql-editor': {
            padding: 0,
          },
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Container>
  );
}
