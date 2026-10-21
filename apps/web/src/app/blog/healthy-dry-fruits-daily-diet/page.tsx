import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbsJsonLd, ArticleJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Top 5 Healthy Dry Fruits for Your Daily Diet | Bansal Foods',
  description:
    'Discover the top 5 dry fruits for daily nutrition: Kashmiri Mamra almonds, walnuts, pistachios, cashews, and dates. Scientific health benefits, recommended intake, and buying guide.',
  alternates: {
    canonical: 'https://bansalfoods.in/blog/healthy-dry-fruits-daily-diet',
  },
  openGraph: {
    title: 'Top 5 Healthy Dry Fruits for Daily Nutrition | Bansal Foods',
    description:
      'Boost memory, heart health, and energy with daily portions of Kashmiri almonds, walnuts, and Afghan pistachios.',
    url: 'https://bansalfoods.in/blog/healthy-dry-fruits-daily-diet',
    images: ['/product-almonds.jpg'],
  },
};

export default function HealthyDryFruitsArticle() {
  return (
    <article className="min-h-screen bg-[#FAF9F6] py-10 sm:py-16">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Blog', item: '/blog' },
          {
            name: 'Top 5 Healthy Dry Fruits',
            item: '/blog/healthy-dry-fruits-daily-diet',
          },
        ]}
      />
      <ArticleJsonLd
        headline="Top 5 Healthy Dry Fruits to Include in Your Daily Diet"
        description="Comprehensive guide on the health benefits, nutrition profiles, and recommended daily intake of almonds, walnuts, pistachios, cashews, and dates."
        slug="healthy-dry-fruits-daily-diet"
        imageUrl="/product-almonds.jpg"
        datePublished="2026-10-15T09:00:00+05:30"
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
              Health &amp; Nutrition
            </span>
            <span>Published: 15 October 2026</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#1F140D] tracking-tight leading-tight">
            Top 5 Healthy Dry Fruits to Include in Your Daily Diet
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            In Ayurvedic wisdom and modern clinical nutrition alike, dry fruits are recognized as
            nutrient-dense powerhouses. Here is how adding a handful of authentic dry fruits from
            Khari Baoli can revitalize your wellness routine.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-10 shadow-md">
          <Image
            src="/product-almonds.jpg"
            alt="Handful of premium Kashmiri Mamra almonds on a wooden background"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              1. Kashmiri Mamra Almonds: The Memory &amp; Brain Booster
            </h2>
            <p>
              Unlike mass-cultivated California almonds,{' '}
              <Link
                href="/category/almonds"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                Kashmiri Mamra Almonds
              </Link>{' '}
              are grown organically in high-altitude Himalayan valleys. They contain up to 50%
              natural oils and are exceptionally rich in vitamin E, magnesium, and dietary fiber.
            </p>
            <p className="bg-[#FAF7F2] p-4 rounded-xl border-l-4 border-[#C88C3C] text-xs sm:text-sm">
              <strong>Nutritional Tip:</strong> Soak 5-7 Mamra almonds overnight and consume them
              first thing in the morning with peeled skins for optimal nutrient bioavailability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              2. Walnuts (Akhrot): King of Omega-3 Fatty Acids
            </h2>
            <p>
              Known for their signature brain-like contours,{' '}
              <Link
                href="/category/walnuts"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                Walnut Kernels
              </Link>{' '}
              contain higher amounts of Alpha-Linolenic Acid (ALA)—a plant-based Omega-3—than any
              other common tree nut. Regular consumption supports cognitive performance, regulates
              blood pressure, and lowers bad LDL cholesterol.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              3. Afghan Pistachios (Pista): The Antioxidant Dynamo
            </h2>
            <p>
              Rich in lutein, zeaxanthin, and potassium,{' '}
              <Link
                href="/category/pistachios"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                Afghan Green Pistachios
              </Link>{' '}
              promote eye health and blood sugar stability. Being low in calories yet high in
              protein, they make the ideal afternoon guilt-free snack.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              4. W320 Jumbo Cashews (Kaju): Healthy Fats &amp; Zinc
            </h2>
            <p>
              Cashews provide easily absorbable monounsaturated fatty acids that support bone
              density, immune defense, and skin elasticity.{' '}
              <Link
                href="/category/cashews"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                Explore our W320 grade cashews
              </Link>{' '}
              sourced directly from certified coastal processing hubs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F140D]">
              5. Ajwa &amp; Medjool Dates (Khajoor): Natural Sustained Energy
            </h2>
            <p>
              Instead of refined sugar snacks, dates offer quick natural fructose balanced with
              soluble fiber, iron, and potassium.{' '}
              <Link
                href="/category/dates"
                className="text-[#8C5D17] font-bold underline hover:text-[#5B3708]"
              >
                Bansal Foods Medjool &amp; Ajwa Dates
              </Link>{' '}
              provide smooth, caramel-like sweetness with zero added preservatives.
            </p>
          </section>

          {/* Internal CTA Card */}
          <div className="mt-10 p-6 bg-[#FAF0E8] rounded-2xl border border-[#EADBCA] text-center space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#1F140D]">
              Order Pure Khari Baoli Dry Fruits Online
            </h3>
            <p className="text-xs text-gray-600 max-w-lg mx-auto">
              Get genuine Kashmiri Mamra almonds, cashews, pistachios, and curated gift boxes
              shipped fresh directly to your home anywhere in India.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 bg-[#8C5D17] hover:bg-[#73430C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
