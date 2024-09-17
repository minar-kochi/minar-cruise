import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: [`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap.xml`, `${process.env.NEXT_PUBLIC_DOMAIN}/blog/sitemap.xml`],
  }
}