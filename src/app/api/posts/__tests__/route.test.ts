import { GET, POST } from '../route';
import { store } from '@/lib/store/store';

// Mock the store
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
      createBlogPost: {
        initiate: jest.fn(),
      },
    },
  },
}));

describe('Posts API Routes', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'Test Post',
      content: 'Test content',
      author: 'Test Author',
      createdAt: '2025-04-14T00:00:00Z',
      updatedAt: '2025-04-14T00:00:00Z',
      tags: ['test'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('returns filtered posts with pagination', async () => {
      (store.dispatch as jest.Mock).mockResolvedValueOnce({
        data: {
          posts: mockPosts,
          total: 1,
          hasMore: false,
        },
      });

      const request = {
        nextUrl: new URL('http://localhost:3001/api/posts?page=1&pageSize=10'),
      };

      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.posts).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.hasMore).toBe(false);
    });

    it('handles API error gracefully', async () => {
    
      (store.dispatch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const request = {
        nextUrl: new URL('http://localhost:3001/api/posts'),
      };

      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch posts');
    });
  });

  describe('POST /api/posts', () => {
    const mockNewPost = {
      title: 'New Post',
      content: 'New content',
      author: 'New Author',
      tags: ['new'],
    };

    it('creates a new post successfully', async () => {
      // Mock successful post creation
      (store.dispatch as jest.Mock).mockResolvedValueOnce({
        data: {
          ...mockNewPost,
          id: '2',
          createdAt: '2025-04-14T00:00:00Z',
          updatedAt: '2025-04-14T00:00:00Z',
        },
      });

      const request = {
        json: () => Promise.resolve(mockNewPost),
      };

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(mockNewPost.title);
      expect(data.content).toBe(mockNewPost.content);
      expect(data.author).toBe(mockNewPost.author);
    });

    it('validates required fields', async () => {
      const request = {
        json: () => Promise.resolve({ title: 'Missing Fields' }),
      };

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('handles API error', async () => {
    
      (store.dispatch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const request = {
        json: () => Promise.resolve(mockNewPost),
      };

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create post');
    });
  });
});
