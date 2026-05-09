export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/adminlogin', '/adminproducts'],
    },
    sitemap: 'https://www.zyrastyllz.com/sitemap.xml',
  }
}