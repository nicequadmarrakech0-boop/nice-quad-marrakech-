import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://nicequadmarrakech.com' // Replace with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/unauthorized', '/api/', '/test'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
