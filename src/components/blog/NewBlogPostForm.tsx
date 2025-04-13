'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Button, Autocomplete, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from './RichTextEditor';
import { useRouter } from 'next/navigation';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(1, 'Content is required'),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface NewBlogPostFormProps {
  open: boolean;
  onClose: () => void;
}

export default function NewBlogPostForm({ open, onClose }: NewBlogPostFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      author: '',
      content: '',
    },
  });

  const handleClose = () => {
    reset();
    setTags([]);
    onClose();
  };

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Reset form and redirect
      handleClose();
      router.refresh(); // Refresh the page to show new post
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { overflowY: 'visible' }
      }}
    >
      <DialogTitle>Create New Blog Post</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isSubmitting}
            />

            <TextField
              label="Author"
              {...register('author')}
              error={!!errors.author}
              helperText={errors.author?.message}
              disabled={isSubmitting}
            />

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Box>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Content"
                  />
                  {errors.content && (
                    <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                      {errors.content.message}
                    </Box>
                  )}
                </Box>
              )}
            />

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={tags}
              onChange={(_, newValue) => setTags(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags"
                  disabled={isSubmitting}
                />
              )}
              sx={{ zIndex: 1301 }} // Higher than Dialog's z-index
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Create Post'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
