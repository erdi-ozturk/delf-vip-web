import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Gizlemek istediğin yer varsa
    },
    sitemap: 'https://delfvip.com/sitemap.xml',
  }
}