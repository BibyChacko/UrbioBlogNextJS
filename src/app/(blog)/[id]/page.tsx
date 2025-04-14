import { Container, Typography, Box, Chip, Alert } from '@mui/material';
import { store } from '@/lib/store/store';
import { blogApi } from '@/lib/store/blogApi';
import 'react-quill/dist/quill.snow.css';

interface PageProps {
  params: {
    id: string;
  };
}

// Server Component
export default async function BlogPostPage({ params }: PageProps) {
  try {
    // Get post from RTK Query store
    const { data } = await store.dispatch(
      blogApi.endpoints.getBlogPosts.initiate({})
    );

    if (!data) {
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">Failed to fetch blog posts</Alert>
        </Container>
      );
    }

    const post = data.posts.find(p => p.id === params.id);

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
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load blog post</Alert>
      </Container>
    );
  }
}
