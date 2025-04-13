export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface BlogPostsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  author?: string;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl?: string;
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
  id: string;
}
