import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | Nice Quad Marrakech - Desert Adventure Tips & Guides',
  description: 'Explore our blog for expert tips, guides, and insider knowledge about quad biking, buggy tours, and desert adventures in Marrakech, Morocco.',
  keywords: [
    'marrakech blog',
    'quad biking tips',
    'desert adventure guide',
    'morocco travel blog',
    'marrakech travel tips',
    'buggy tours morocco',
    'desert activities marrakech'
  ],
  openGraph: {
    title: 'Blog | Nice Quad Marrakech - Desert Adventure Tips & Guides',
    description: 'Explore our blog for expert tips, guides, and insider knowledge about quad biking, buggy tours, and desert adventures in Marrakech.',
    type: 'website',
    url: 'https://nicequadmarrakech.com/blogs',
    siteName: 'Nice Quad Marrakech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Nice Quad Marrakech',
    description: 'Expert tips and guides for desert adventures in Marrakech, Morocco.',
  },
  alternates: {
    canonical: 'https://nicequadmarrakech.com/blogs',
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
