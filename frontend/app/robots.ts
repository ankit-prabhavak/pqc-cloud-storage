import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow crawlers to index only public pages
        userAgent: '*',
        allow: ['/', '/login', '/register'],
        disallow: ['/dashboard', '/upload', '/security', '/api/'],
      },
    ],
    sitemap: 'https://pqcstorage.io/sitemap.xml',
  }
}
