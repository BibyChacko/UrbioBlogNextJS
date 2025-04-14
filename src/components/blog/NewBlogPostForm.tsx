'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Button, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from './RichTextEditor';
import { blogApi } from '@/lib/store/blogApi';
import type { CreateBlogPostRequest } from '@/types/blog';

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
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [createPost, { isLoading }] = blogApi.useCreateBlogPostMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      author: '',
      content: '',
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleClose = () => {
    reset();
    setTags([]);
    setError('');
    onClose();
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const onSubmit = async (data: BlogPostFormData) => {
    try {
      setError('');

      const newPost: CreateBlogPostRequest = {
        title: data.title.trim(),
        content: data.content.trim(),
        author: data.author.trim(),
        tags,
        imageUrl: 'https://dummyimage.com/640x480/', // Default image for now
      };

      await createPost(newPost).unwrap();
      
      // Show success toast
      setToast({
        open: true,
        message: 'Blog post created successfully!',
        severity: 'success'
      });
      
      // Reset form
      reset();
      setTags([]);
      setError('');
      onClose();
    } catch (err) {
      // Show error toast
      setToast({
        open: true,
        message: 'Failed to create blog post. Please try again.',
        severity: 'error'
      });
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            height: '90vh',
            overflowY: 'auto'
          }
        }}
      >
        <DialogTitle>Create New Blog Post</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <TextField
                label="Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={isLoading}
                fullWidth
              />

              <TextField
                label="Author"
                {...register('author')}
                error={!!errors.author}
                helperText={errors.author?.message}
                disabled={isLoading}
                fullWidth
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

              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Add Tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    fullWidth
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleAddTag} 
                    variant="outlined"
                    disabled={isLoading}
                  >
                    Add
                  </Button>
                </Stack>

                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      disabled={isLoading}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Create Post'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
