import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BlogPost, CreateBlogPostRequest, BlogPostsResponse } from '@/types/blog';

interface GetBlogPostsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  author?: string;
}

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['BlogPosts', 'BlogPost'],
  endpoints: (builder) => ({
    getBlogPosts: builder.query<BlogPostsResponse, GetBlogPostsRequest>({
      query: (params) => ({
        url: '/posts',
        params: {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search,
          tag: params.tag,
          author: params.author,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'BlogPosts' as const, id })),
              { type: 'BlogPosts', id: 'LIST' },
            ]
          : [{ type: 'BlogPosts', id: 'LIST' }],
    }),
    getBlogPost: builder.query<BlogPost, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'BlogPost', id }],
    }),
    createBlogPost: builder.mutation<BlogPost, CreateBlogPostRequest>({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: [{ type: 'BlogPosts', id: 'LIST' }],
    }),
    updateBlogPost: builder.mutation<BlogPost, Partial<BlogPost>>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'BlogPosts', id }],
    }),
    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogPosts'],
    }),
  }),
});
