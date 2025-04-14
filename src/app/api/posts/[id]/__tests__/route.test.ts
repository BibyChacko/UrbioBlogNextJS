import { GET } from '../route';
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
    },
  },
}));

describe('Single Post API Route', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test content',
    author: 'Test Author',
    createdAt: '2025-04-14T00:00:00Z',
    updatedAt: '2025-04-14T00:00:00Z',
    tags: ['test'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts/[id]', () => {
    it('returns a single post when found', async () => {
      
      (store.dispatch as jest.Mock).mockResolvedValueOnce({
        data: {
          posts: [mockPost],
        },
      });

      const request = {
        nextUrl: new URL('http://localhost:3001/api/posts/1'),
      };

      const context = {
        params: { id: '1' },
      };

      const response = await GET(request as any, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('1');
      expect(data.title).toBe('Test Post');
      expect(data.content).toBe('Test content');
    });

    it('returns 404 when post not found', async () => {
      (store.dispatch as jest.Mock).mockResolvedValueOnce({
        data: {
          posts: [mockPost],
        },
      });

      const request = {
        nextUrl: new URL('http://localhost:3001/api/posts/999'),
      };

      const context = {
        params: { id: '999' },
      };

      const response = await GET(request as any, context);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Post not found');
    });

    it('returns 500 when API call fails', async () => {
      (store.dispatch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const request = {
        nextUrl: new URL('http://localhost:3001/api/posts/1'),
      };

      const context = {
        params: { id: '1' },
      };

      const response = await GET(request as any, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch post');
    });

    it('returns 500 when no data returned', async () => {
      (store.dispatch as jest.Mock).mockResolvedValueOnce({
        data: null,
      });

      const request = {
        nextUrl: new URL('http://localhost:3001/api/posts/1'),
      };

      const context = {
        params: { id: '1' },
      };

      const response = await GET(request as any, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch post');
    });
  });
});
