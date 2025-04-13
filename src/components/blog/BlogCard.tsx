'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
  Button,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const truncateContent = (content: string) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {post.imageUrl && (
        <CardActionArea component={Link} href={`/blog/${post.id}`}>
          <CardMedia
            component="img"
            height="240"
            image={post.imageUrl}
            alt={post.title}
          />
        </CardActionArea>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" color="text.secondary">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {truncateContent(post.content)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5, color: 'primary.main', borderColor: 'primary.main' }}
                />
              ))}
            </Box>
            <Button
              component={Link}
              href={`/blog/${post.id}`}
              color="primary"
              sx={{
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.2s',
                  ml: 1
                },
                '&:hover .MuiSvgIcon-root': {
                  transform: 'translateX(4px)'
                }
              }}
              endIcon={<ArrowForward />}
            >
              Read more
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
