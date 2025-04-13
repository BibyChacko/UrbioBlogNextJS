'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment, Button, Popover, Stack, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams, useRouter } from 'next/navigation';
import NewBlogPostForm from '@/components/blog/NewBlogPostForm';

interface SearchFiltersProps {
  availableTags: string[];
  availableAuthors: string[];
  onSearch: (params: { search?: string; tag?: string; author?: string }) => void;
}

export default function SearchFilters({ availableTags, availableAuthors, onSearch }: SearchFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Initialize state after mount to avoid hydration mismatch
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setMounted(true);
  }, [searchParams]);

  const currentTag = searchParams.get('tag') || '';
  const currentAuthor = searchParams.get('author') || '';
  const hasFilters = !!(searchTerm || currentTag || currentAuthor);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ search: searchTerm || undefined });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch({ search: undefined });
  };

  const handleClearTag = () => {
    onSearch({ tag: undefined });
  };

  const handleClearAuthor = () => {
    onSearch({ author: undefined });
  };

  const handleClearAll = () => {
    setSearchTerm('');
    onSearch({ search: undefined, tag: undefined, author: undefined });
  };

  // Don't render until after hydration to avoid mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: hasFilters ? 2 : 0,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '300px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            size="small"
            color={hasFilters ? "primary" : "inherit"}
          >
            Filters {hasFilters && `(${[currentTag, currentAuthor].filter(Boolean).length})`}
          </Button>

          {hasFilters && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearAll}
              size="small"
              color="inherit"
            >
              Clear All
            </Button>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewPostOpen(true)}
          size="small"
        >
          New Post
        </Button>
      </Box>

      {hasFilters && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={handleClearSearch}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {currentTag && (
            <Chip
              label={`Tag: ${currentTag}`}
              onDelete={handleClearTag}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {currentAuthor && (
            <Chip
              label={`Author: ${currentAuthor}`}
              onDelete={handleClearAuthor}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack spacing={2} sx={{ p: 2, minWidth: 300 }}>
          <TextField
            select
            fullWidth
            placeholder="Filter by Tag"
            value={currentTag}
            onChange={(e) => {
              onSearch({ tag: e.target.value || undefined });
              handleClose();
            }}
            SelectProps={{
              native: true
            }}
            size="small"
          >
            <option value="">Filter by Tag</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            placeholder="Filter by Author"
            value={currentAuthor}
            onChange={(e) => {
              onSearch({ author: e.target.value || undefined });
              handleClose();
            }}
            SelectProps={{
              native: true
            }}
            size="small"
          >
            <option value="">Filter by Author</option>
            {availableAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </TextField>
        </Stack>
      </Popover>

      <NewBlogPostForm open={isNewPostOpen} onClose={() => setIsNewPostOpen(false)} />
    </Box>
  );
}
