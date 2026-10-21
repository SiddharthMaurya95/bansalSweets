import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bansalfoods.in';
  const currentDate = new Date().toISOString();

  // Primary static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/healthy-dry-fruits-daily-diet`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/dry-fruit-hampers-perfect-gift`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/orders/track`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Category taxonomy routes
  const categories = [
    'almonds',
    'cashews',
    'pistachios',
    'walnuts',
    'raisins',
    'dates',
    'seeds',
    'dry-fruit-mix',
    'gift-boxes',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Key product routes
  const productSlugs = [
    'kashmiri-mamra-almonds',
    'california-almonds',
    'w320-premium-cashews',
    'roasted-salted-cashews',
    'afghan-green-pistachios',
    'kashmiri-snow-white-walnut-kernels',
    'chilean-walnut-kernels',
    'premium-green-raisins',
    'black-raisins-afghan',
    'ajwa-dates-khajoor',
    'medjool-dates-khajur',
    'premium-figs-anjeer',
    'raw-chia-seeds-omega-rich',
    'roasted-pumpkin-seeds',
    'assorted-royal-dry-fruit-mix-panchmeva',
    'kashmiri-heritage-panchmeva-prasad-mix',
    'roasted-salted-trail-mix',
    'daily-healthy-energy-nut-fruit-mix',
    'omega-3-power-nut-seed-fusion-mix',
    'royal-festive-party-snack-mix',
    'premium-dry-fruits-celebration-box',
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
