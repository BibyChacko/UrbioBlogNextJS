'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
  Alert,
} from '@mui/material';
import { CreateBlogPostRequest } from '@/types/blog';
import { blogApi } from '@/lib/store/blogApi';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type FormInputs = {
  title: string;
  content: string;
  author: string;
  imageUrl: string | null;
};

const schema: yup.ObjectSchema<FormInputs> = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  author: yup.string().required('Author is required'),
  imageUrl: yup.string().nullable().default(null),
}).required();

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
];

export default function NewBlogPostForm() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagError, setTagError] = useState<string | null>(null);
  
  const [createPost, { isLoading, error }] = blogApi.useCreateBlogPostMutation();
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
      imageUrl: null,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
    setTags([]);
    setTagError(null);
  };

  const onSubmit = async (data: FormInputs) => {
    if (tags.length === 0) {
      setTagError('At least one tag is required');
      return;
    }
    setTagError(null);

    try {
      const postData: CreateBlogPostRequest = {
        ...data,
        tags,
        imageUrl: data.imageUrl || undefined,
      };
      await createPost(postData).unwrap();
      handleClose();
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        New Blog Post
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Blog Post</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to create post. Please try again.
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />

              <TextField
                label="Author"
                {...register('author')}
                error={!!errors.author}
                helperText={errors.author?.message}
              />

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Box>
                    <ReactQuill
                      {...field}
                      modules={quillModules}
                      formats={quillFormats}
                      theme="snow"
                      style={{ minHeight: '200px', marginBottom: '20px' }}
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
                onChange={(_, newValue) => {
                  setTags(newValue.filter((tag): tag is string => typeof tag === 'string'));
                  setTagError(null);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    error={!!tagError}
                    helperText={tagError}
                  />
                )}
              />

              <TextField
                label="Image URL (optional)"
                {...register('imageUrl')}
              />
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
