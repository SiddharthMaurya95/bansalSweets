import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';
import { ArrowRightIcon } from '@/components/ThemeIcons';

export const metadata: Metadata = {
  title: 'Dry Fruits Blog & Nutrition Guides | Bansal Foods Khari Baoli',
  description:
    'Explore nutritional benefits of Kashmiri Mamra almonds, cashews, and walnuts. Read festive dry fruit hamper gifting guides and wellness tips from Khari Baoli, Old Delhi.',
  alternates: {
    canonical: 'https://bansalfoods.in/blog',
  },
  openGraph: {
    title: 'Dry Fruits Blog & Guides | Bansal Foods',
    description:
      'Nutritional facts, recipes, and seasonal dry fruit gifting guides direct from Khari Baoli.',
    url: 'https://bansalfoods.in/blog',
    images: ['/og-image.jpg'],
  },
};

const ARTICLES = [
  {
    slug: 'healthy-dry-fruits-daily-diet',
    title: 'Top 5 Healthy Dry Fruits to Include in Your Daily Diet',
    excerpt:
      'Discover the science-backed health benefits of Kashmiri Mamra almonds, walnuts, pistachios, cashews, and dates for energy, heart health, and immunity.',
    category: 'Health & Nutrition',
    readTime: '5 min read',
    publishedDate: '15 October 2026',
    image: '/product-almonds.jpg',
  },
  {
    slug: 'dry-fruit-hampers-perfect-gift',
    title: 'Why Dry Fruit Hampers Make the Perfect Gift for Weddings & Diwali',
    excerpt:
      'From corporate appreciation to festive celebrations and weddings, discover why authentic Khari Baoli dry fruit hampers represent timeless elegance and wellness.',
    category: 'Gifting Ideas',
    readTime: '4 min read',
    publishedDate: '10 October 2026',
    image: '/product-gift-hamper.jpg',
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 sm:py-16">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Blog & Articles', item: '/blog' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A05E28]">
            KNOWLEDGE &amp; NUTRITION
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#1F140D] tracking-tight">
            Dry Fruits &amp; Wellness Blog
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Authentic insights from Old Delhi’s historic Khari Baoli mandi on dry fruit grades,
            daily wellness benefits, and festive gifting inspiration.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ARTICLES.map((art) => (
            <article
              key={art.slug}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#E5A93C] text-[#1B1F2A] text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  {art.category}
                </span>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span>{art.publishedDate}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D] group-hover:text-[#8C5D17] transition-colors leading-snug">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Link
                    href={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5D17] hover:underline"
                  >
                    <span>Read Full Article</span>
                    <ArrowRightIcon size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Internal Navigation Bar */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-gray-100 text-center max-w-4xl mx-auto shadow-2xs">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1F140D] mb-2">
            Looking for authentic Khari Baoli dry fruits?
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Order premium almonds, cashews, pistachios, walnuts, and gift hampers delivered across
            India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/category/almonds"
              className="px-4 py-2 bg-[#FAF0E8] text-[#8C5D17] rounded-xl text-xs font-bold hover:bg-[#F2DEC9] transition-colors"
            >
              Shop Almonds
            </Link>
            <Link
              href="/category/cashews"
              className="px-4 py-2 bg-[#FAF0E8] text-[#8C5D17] rounded-xl text-xs font-bold hover:bg-[#F2DEC9] transition-colors"
            >
              Shop Cashews
            </Link>
            <Link
              href="/category/gift-boxes"
              className="px-4 py-2 bg-[#B91C1C] text-white rounded-xl text-xs font-bold hover:bg-[#991B1B] transition-colors"
            >
              Gift Hampers
            </Link>
            <Link
              href="/wholesale"
              className="px-4 py-2 bg-[#1B2533] text-white rounded-xl text-xs font-bold hover:bg-[#0E151F] transition-colors"
            >
              Wholesale Bulk Rates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
