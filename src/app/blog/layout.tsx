import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Urbio LED - Smart Lighting Solutions',
  description: 'Discover the latest insights about LED lighting, smart home automation, and energy efficiency tips from Urbio LED experts.',
  keywords: 'LED lighting, smart home, automation, energy efficiency, Urbio LED',
  openGraph: {
    title: 'Urbio LED Blog - Smart Lighting Insights',
    description: 'Expert articles on LED lighting, smart home automation, and energy efficiency.',
    images: [
      {
        url: '/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Urbio LED Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urbio LED Blog - Smart Lighting Insights',
    description: 'Expert articles on LED lighting, smart home automation, and energy efficiency.',
    images: ['/blog-og-image.jpg'],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
