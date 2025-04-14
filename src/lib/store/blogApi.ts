import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BlogPost, CreateBlogPostRequest, BlogPostsResponse } from '@/types/blog';

interface GetBlogPostsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  author?: string;
}

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use localhost
    return 'http://localhost:3001';
  }
  // Client-side: use relative URL
  return '';
};

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${getBaseUrl()}/api`,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['BlogPosts', 'BlogPost'],
  endpoints: (builder) => ({
    getBlogPosts: builder.query<BlogPostsResponse, GetBlogPostsRequest>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page.toString());
        if (params.pageSize) query.set('pageSize', params.pageSize.toString());
        if (params.search) query.set('search', params.search);
        if (params.tag) query.set('tag', params.tag);
        if (params.author) query.set('author', params.author);

        return {
          url: 'posts',
          params: Object.fromEntries(query)
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'BlogPosts' as const, id })),
              { type: 'BlogPosts', id: 'LIST' }
            ]
          : [{ type: 'BlogPosts', id: 'LIST' }]
    }),
    getBlogPost: builder.query<BlogPost, string>({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'BlogPost', id }],
    }),
    createBlogPost: builder.mutation<BlogPost, CreateBlogPostRequest>({
      query: (body) => ({
        url: 'posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'BlogPosts', id: 'LIST' }]
    }),
    updateBlogPost: builder.mutation<BlogPost, Partial<BlogPost>>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'BlogPosts', id }],
    }),
    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogPosts'],
    }),
  }),
});
