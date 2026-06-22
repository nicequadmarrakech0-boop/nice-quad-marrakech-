import { MetadataRoute } from 'next'
import { experiences } from '@/data/experiences'

// Force dynamic to avoid build-time Convex initialization
export const dynamic = 'force-dynamic'

const locales = ['en', 'fr'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nicequadmarrakech.com'

  // Helper to generate URL for a locale
  const getLocalizedUrl = (path: string, locale: string) => {
    if (locale === 'en') {
      return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${locale}${path}`;
  };

  // Static pages (only indexable pages - excluded /add-review as it has noindex)
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: getLocalizedUrl('', locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: getLocalizedUrl('/experiences', locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: getLocalizedUrl('/reviews', locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: getLocalizedUrl('/blogs', locale),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]);

  // Dynamic booking pages for each experience (both locales)
  const bookingPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    experiences
      .filter(exp => exp.id !== "buggy-polaris-rs1" && exp.id !== "buggy-canam-maverick-4seat")
      .map((experience) => ({
        url: getLocalizedUrl(`/booking?id=${experience.id}`, locale),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  );

  // Dynamic blog pages - fetch from Convex (both locales)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    // Dynamic import to avoid build-time errors
    const { ConvexHttpClient } = await import("convex/browser");
    const { api } = await import("@/convex/_generated/api");
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const blogSlugs = await convex.query(api.blogs.getAllBlogSlugs);
    blogPages = locales.flatMap((locale) =>
      blogSlugs.map((blog) => ({
        url: getLocalizedUrl(`/blog/${blog.slug}`, locale),
        lastModified: new Date(blog.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    );
  } catch (error) {
    // If Convex is not available, continue without blog pages
    console.error('Error fetching blog slugs for sitemap:', error);
  }

  return [...staticPages, ...bookingPages, ...blogPages]
}
