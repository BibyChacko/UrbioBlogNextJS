'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  TextField, 
  Popover, 
  IconButton,
  useTheme,
  useMediaQuery, 
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams } from 'next/navigation';
import NewBlogPostForm from '@/components/blog/NewBlogPostForm';

interface SearchFiltersProps {
  availableTags: string[];
  availableAuthors: string[];
  onSearch: (params: { search?: string; tag?: string; author?: string }) => void;
}

export default function SearchFilters({ 
  onSearch, 
  availableTags, 
  availableAuthors 
}: SearchFiltersProps) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentTag = searchParams.get('tag') || '';
  const currentAuthor = searchParams.get('author') || '';
  const hasFilters = Boolean(searchTerm || currentTag || currentAuthor);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch({ search: value || undefined });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    onSearch({ search: undefined, tag: undefined, author: undefined });
    handleFilterClose();
  };

  const handleTagChange = (value: string) => {
    onSearch({ tag: value || undefined });
    handleFilterClose();
  };

  const handleAuthorChange = (value: string) => {
    onSearch({ author: value || undefined });
    handleFilterClose();
  };

  // Initialize state after mount to avoid hydration mismatch
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setMounted(true);
  }, [searchParams]);

  // Don't render until after hydration to avoid mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Stack 
        spacing={2} 
        sx={{ 
          mb: hasFilters ? 2 : 0 
        }}
      >
        {/* Search and Action Buttons */}
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{
            flexWrap: { xs: 'nowrap', sm: 'wrap' },
            gap: 1
          }}
        >
          {/* Search Field - Always visible but styled differently for mobile */}
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search posts..."
            size="small"
            sx={{ 
              flexGrow: 1,
              minWidth: { xs: '120px', sm: '200px' }
            }}
            InputProps={{
              startAdornment: isMobile ? <SearchIcon sx={{ mr: 1 }} /> : null
            }}
          />

          {/* Filter Button/Icon */}
          {isMobile ? (
            <IconButton 
              onClick={handleFilterClick}
              size="small"
              sx={{ flexShrink: 0 }}
              color={hasFilters ? "primary" : "default"}
            >
              <FilterListIcon />
            </IconButton>
          ) : (
            <Button
              onClick={handleFilterClick}
              variant="outlined"
              startIcon={<FilterListIcon />}
              size="small"
              color={hasFilters ? "primary" : "inherit"}
            >
              Filters
            </Button>
          )}

          {/* New Post Button/Icon */}
          {isMobile ? (
            <IconButton 
              onClick={() => setIsNewPostOpen(true)}
              size="small"
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              <AddIcon />
            </IconButton>
          ) : (
            <Button
              onClick={() => setIsNewPostOpen(true)}
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
            >
              New Post
            </Button>
          )}

          {/* Clear Filters Button - Show as icon on mobile */}
          {hasFilters && (
            isMobile ? (
              <IconButton
                size="small"
                onClick={handleClearAll}
                color="default"
                sx={{ flexShrink: 0 }}
              >
                <ClearIcon />
              </IconButton>
            ) : (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                size="small"
                color="inherit"
              >
                Clear All
              </Button>
            )
          )}
        </Stack>

        {/* Active Filters - Show in a scrollable row on mobile */}
        {hasFilters && (
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              mt: 1,
              overflowX: 'auto',
              pb: 1, // Add padding to show scrollbar
              '::-webkit-scrollbar': {
                height: '4px',
              },
              '::-webkit-scrollbar-track': {
                background: theme.palette.grey[100],
                borderRadius: '2px',
              },
              '::-webkit-scrollbar-thumb': {
                background: theme.palette.grey[400],
                borderRadius: '2px',
              },
            }}
          >
            {searchTerm && (
              <Chip
                size="small"
                label={`Search: ${searchTerm}`}
                onDelete={() => {
                  setSearchTerm('');
                  onSearch({ search: undefined });
                }}
              />
            )}
            {currentTag && (
              <Chip
                size="small"
                label={`Tag: ${currentTag}`}
                onDelete={() => onSearch({ tag: undefined })}
              />
            )}
            {currentAuthor && (
              <Chip
                size="small"
                label={`Author: ${currentAuthor}`}
                onDelete={() => onSearch({ author: undefined })}
              />
            )}
          </Stack>
        )}
      </Stack>

      {/* Filter Popover - Same for both mobile and desktop */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: { xs: '280px', sm: '320px' },
            p: 2,
            mt: 1
          }
        }}
      >
        <Stack spacing={2}>
          <TextField
            select
            label="Filter by Tag"
            value={currentTag}
            onChange={(e) => handleTagChange(e.target.value)}
            SelectProps={{
              native: true
            }}
            size="small"
            fullWidth
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
            label="Filter by Author"
            value={currentAuthor}
            onChange={(e) => handleAuthorChange(e.target.value)}
            SelectProps={{
              native: true
            }}
            size="small"
            fullWidth
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
