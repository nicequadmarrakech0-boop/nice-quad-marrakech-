export const dynamic = 'force-dynamic';

import BlogDetailClient from './BlogDetailClient';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
