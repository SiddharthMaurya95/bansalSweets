import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbsJsonLd, ArticleJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Why Dry Fruit Hampers Make the Perfect Gift | Bansal Foods',
  description:
    'Discover why premium dry fruit boxes, brass trays, and brocade potlis from Khari Baoli are the gold standard for wedding invitations, Diwali, and corporate gifting.',
  alternates: {
    canonical: 'https://bansalfoods.in/blog/dry-fruit-hampers-perfect-gift',
  },
  openGraph: {
    title: 'Why Dry Fruit Hampers Make the Perfect Gift | Bansal Foods',
    description:
      'Timeless elegance, health, and auspicious symbolism: the complete guide to gifting dry fruits.',
    url: 'https://bansalfoods.in/blog/dry-fruit-hampers-perfect-gift',
    images: ['/product-gift-hamper.jpg'],
  },
};

export default function DryFruitGiftingArticle() {
  return (
    <article className="min-h-screen bg-[#FAF9F6] py-10 sm:py-16">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Blog', item: '/blog' },
          {
            name: 'Dry Fruit Hampers Gifting Guide',
            item: '/blog/dry-fruit-hampers-perfect-gift',
          },
        ]}
      />
      <ArticleJsonLd
        headline="Why Dry Fruit Hampers Make the Perfect Gift for Weddings & Festivals"
        description="Explore the cultural heritage, health benefits, and luxurious presentation of authentic Khari Baoli dry fruit hampers for corporate gifting, Diwali, and weddings."
        slug="dry-fruit-hampers-perfect-gift"
        imageUrl="/product-gift-hamper.jpg"
        datePublished="2026-10-10T10:00:00+05:30"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <Link
            href="/blog"
            className="text-xs font-bold text-[#8C5D17] hover:underline inline-flex items-center gap-1"
          >
            ← Back to All Articles
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="bg-[#FAF0E8] text-[#8C5D17] font-bold px-2.5 py-0.5 rounded-full">
              Gifting Ideas
            </span>
            <span>Published: 10 October 2026</span>
            <span>•</span>
            <span>4 min read</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#1F140D] tracking-tight leading-tight">
            Why Dry Fruit Hampers Make the Perfect Gift for Weddings &amp; Festivals
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            From regal Mughal courts in Old Delhi to modern corporate boardrooms, gifting dry fruits
            embodies prosperity, goodwill, and enduring health. Here is why dry fruit boxes continue
            to outshine sweets and chocolates.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-10 shadow-md">
          <Image
            src="/product-gift-hamper.jpg"
            alt="Handcrafted dry fruit celebration gift box with brass details"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              1. The Timeless Symbol of Shubh Aashirwad (Auspicious Blessings)
            </h2>
            <p>
              In Indian traditions, nuts such as almonds, cashews, and walnuts represent longevity,
              fertility, and abundance. Unlike perishable sweets that spoil quickly, dry fruits
              retain their nutritional excellence and flavor for months.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              2. Health Conscious &amp; Dietary Friendly
            </h2>
            <p>
              Modern recipients are increasingly conscious of refined sugars, artificial coloring,
              and dairy intolerance. A box of handpicked{' '}
              <Link
                href="/category/gift-boxes"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                festive dry fruit gift hampers
              </Link>{' '}
              caters to fitness lovers, diabetic elders, and vegan diets alike.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              3. Corporate Gifting with Lasting Impression
            </h2>
            <p>
              Leading companies choose customized executive boxes filled with premium W240 cashews,
              Mamra almonds, and Turkish apricots to thank clients and partners. With{' '}
              <Link
                href="/wholesale"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                Bansal Foods wholesale bulk gifting
              </Link>
              , businesses can customize branded ribbon bands, thank-you cards, and multi-tier
              brocade potlis.
            </p>
          </section>

          {/* CTA Box */}
          <div className="mt-10 p-6 bg-[#FAF0E8] rounded-2xl border border-[#EADBCA] text-center space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#1F140D]">
              Custom Wedding &amp; Corporate Gift Hampers
            </h3>
            <p className="text-xs text-gray-600 max-w-lg mx-auto">
              Need custom gift boxes for Diwali, weddings, or corporate festivities? Contact our Khari
              Baoli team for wholesale pricing and personalized packaging.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/category/gift-boxes"
                className="px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                View Gift Boxes
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-[#1F140D] rounded-xl text-xs font-bold transition-colors"
              >
                Contact Gifting Specialist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
