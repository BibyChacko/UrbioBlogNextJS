'use client';

import { StoreProvider } from '@/components/providers/StoreProvider';

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
