import { render, screen } from '@testing-library/react';
import BlogPostPage from '../page';
import { store } from '@/lib/store/store';


jest.mock('@mui/material', () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Chip: ({ label }: { label: string }) => <span>{label}</span>,
  Alert: ({ children, severity }: { children: React.ReactNode; severity: string }) => (
    <div role="alert" data-severity={severity}>{children}</div>
  ),
}));

jest.mock('@/lib/store/store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

jest.mock('@/lib/store/blogApi', () => ({
  blogApi: {
    endpoints: {
      getBlogPosts: {
        initiate: jest.fn(),
      },
    },
  },
}));

describe('BlogPostPage', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: '<p>Test content</p>',
    author: 'Test Author',
    createdAt: '2025-04-14T00:00:00Z',
    tags: ['test', 'blog'],
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog post when found', async () => {
    (store.dispatch as jest.Mock).mockResolvedValueOnce({
      data: {
        posts: [mockPost],
      },
    });

    const params = { id: '1' };
    const page = await BlogPostPage({ params });
    render(page);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('blog')).toBeInTheDocument();
  });

  it('renders not found message when post does not exist', async () => {
    (store.dispatch as jest.Mock).mockResolvedValueOnce({
      data: {
        posts: [],
      },
    });

    const params = { id: '999' };
    const page = await BlogPostPage({ params });
    render(page);

    expect(screen.getByText('Blog post not found')).toBeInTheDocument();
  });

  it('renders error message when API call fails', async () => {
      (store.dispatch as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    const params = { id: '1' };
    const page = await BlogPostPage({ params });
    render(page);

    expect(screen.getByText('Failed to fetch blog posts')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    (store.dispatch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const params = { id: '1' };
    const page = await BlogPostPage({ params });
    render(page);

    expect(screen.getByText('Failed to load blog post')).toBeInTheDocument();
  });
});
