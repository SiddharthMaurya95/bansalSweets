import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bansalfoods.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout',
          '/checkout/*',
          '/account',
          '/account/*',
          '/login',
          '/register',
          '/auth/',
          '/auth/*',
          '/order-success',
          '/order-success/*',
          '/order-confirmation',
          '/order-confirmation/*',
          '/*?*q=*', // Prevent crawler duplicate indexation on internal search parameters
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
