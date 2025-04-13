import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogCard from '../BlogCard';
import { BlogPost } from '@/types/blog';
import { describe, it, expect } from '@jest/globals';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('BlogCard', () => {
  const mockPost: BlogPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test content',
    excerpt: 'Test excerpt',
    author: 'Test Author',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
    tags: ['test', 'jest'],
  };

  it('renders blog post information correctly', () => {
    render(<BlogCard post={mockPost} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    
    // Check if excerpt is rendered
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    
    // Check if author is rendered
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
    
    // Check if tags are rendered
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('jest')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    const postWithImage = {
      ...mockPost,
      imageUrl: 'test-image.jpg',
    };
    
    render(<BlogCard post={postWithImage} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });
});
