# Urbio Blog

A basic blog listing, with infinite scroll and tag-based filtering and also option to add new blog posts.

## Features

- Server-side rendered blog posts
- Client-side pagination with infinite scroll
- Rich text editor for creating posts
- Mobile-responsive design
- Tag-based filtering and search
- Material-UI components

## Getting Started

1. Clone the repository:

2. Install dependencies:
    npm i --legacy-peer-deps

3. Run the development server:
    npm run dev

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
urbio/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── (blog)/      # Blog routes with layout
│   │   └── api/         # API routes
│   ├── components/      # Reusable React components
│   │   ├── blog/        # Blog-specific components
│   │   └── common/      # Shared components
│   ├── hooks/           # Custom React hooks
│   ├── lib/            # Core utilities
│   │   ├── db/         # Data layer (singleton store)
│   │   ├── store/      # State management (GetIt + Riverpod)
│   │   └── utils/      # Helper functions
│   └── types/          # TypeScript type definitions
```



1. **Initial Load (SSR)**:
   - Server component fetches initial data using singleton store
   - Data is pre-rendered in HTML
   - Client hydrates with RTK Query for subsequent requests

2. **Client-side Pagination**:
   - Managed by BlogPosts component
   - Uses URL-based state for filters
   - Infinite scroll with optimistic updates


## Key Implementation Details

1. **Singleton Store**:
   ```typescript
   // src/lib/db/posts.ts
   class PostStore {
     private static instance: PostStore;
     private posts: BlogPost[] = [];

     static getInstance() {
       if (!PostStore.instance) {
         PostStore.instance = new PostStore();
       }
       return PostStore.instance;
     }
   }
   ```

2. **Server-Side Rendering**:
   ```typescript
   // src/app/(blog)/page.tsx
   export default async function BlogPage({ searchParams }) {
     // Pre-fetch initial data
     await store.dispatch(
       blogApi.util.prefetch('getBlogPosts', { page: 1 })
     );
     return <BlogPosts initialPage={1} />;
   }
   ```

3. **Client-Side Pagination**:
   ```typescript
   // src/hooks/useBlogPosts.ts
   const { data, hasMore } = useBlogPostsQuery({
     page,
     pageSize: 10,
     ...filters
   });


## Challenges
Well, i was more fond of React Query not a big fan of RTK Query. For adding new blog posts, i was intially using quill, but it doesnt worked , anyhow tiptap is decent.