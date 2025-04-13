'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Popover,
  Paper,
  Typography,
  InputAdornment,
  Stack,
  Button,
  Chip,
  Collapse,
  Fade,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';

interface SearchFiltersProps {
  availableTags: string[];
  availableAuthors: string[];
}

export default function SearchFilters({ availableTags, availableAuthors }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(() => searchParams.get('search') || '');
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (value: string) => {
    clearTimeout(searchDebounce);
    setSearchDebounce(setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`/blog?${params.toString()}`);
    }, 300));
  };

  const handleTagChange = (_: any, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('tag', value);
    } else {
      params.delete('tag');
    }
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
    handleClose();
  };

  const handleAuthorChange = (_: any, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('author', value);
    } else {
      params.delete('author');
    }
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
    handleClose();
  };

  const handleClearFilter = (type: 'search' | 'tag' | 'author') => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(type);
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
  };

  const handleClearAll = () => {
    router.push('/blog');
  };

  const activeFilters = {
    search: searchValue,
    tag: searchParams.get('tag') || '',
    author: searchParams.get('author') || '',
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search posts..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          onClick={handleFilterClick}
          color={hasActiveFilters ? "primary" : "default"}
          sx={{ position: 'relative' }}
        >
          <FilterListIcon />
          {hasActiveFilters && (
            <Chip
              label={Object.values(activeFilters).filter(Boolean).length}
              color="primary"
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                height: '20px',
                minWidth: '20px',
              }}
            />
          )}
        </IconButton>

        <Fade in={hasActiveFilters}>
          <Button
            startIcon={<ClearAllIcon />}
            size="small"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </Fade>
      </Box>

      <Collapse in={hasActiveFilters}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {activeFilters.search && (
            <Chip
              label={`Search: ${activeFilters.search}`}
              onDelete={() => handleClearFilter('search')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {activeFilters.tag && (
            <Chip
              label={`Tag: ${activeFilters.tag}`}
              onDelete={() => handleClearFilter('tag')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {activeFilters.author && (
            <Chip
              label={`Author: ${activeFilters.author}`}
              onDelete={() => handleClearFilter('author')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Collapse>

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
        PaperProps={{
          elevation: 3,
          sx: { 
            p: 3,
            width: 320,
            transform: 'scale(1)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.01)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <Autocomplete
            options={availableTags}
            renderInput={(params) => (
              <TextField {...params} label="Filter by tag" size="small" />
            )}
            value={activeFilters.tag}
            onChange={handleTagChange}
          />

          <Autocomplete
            options={availableAuthors}
            renderInput={(params) => (
              <TextField {...params} label="Filter by author" size="small" />
            )}
            value={activeFilters.author}
            onChange={handleAuthorChange}
          />
        </Stack>
      </Popover>
    </Stack>
  );
}
