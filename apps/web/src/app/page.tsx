import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HomeProductCard, type HomeProductItem } from '@/components/HomeProductCard';
import { CustomerReviewsClient } from '@/components/CustomerReviewsClient';
import { NewsletterClient } from '@/components/NewsletterClient';
import {
  WheatHarvestIcon,
  MandiArchIcon,
  DeliveryTruckIcon,
  GenerationsTrustIcon,
  ShieldCheckIcon,
  VarietyBoxesIcon,
  WholesaleDiscountIcon,
  TrustedCommunityIcon,
  PlayIcon,
  ArrowRightIcon,
} from '@/components/ThemeIcons';

export const metadata: Metadata = {
  title: 'Bansal Foods | Premium Dry Fruits & Nuts – Fatehpuri, Old Delhi',
  description:
    'Buy authentic dry fruits, almonds, cashews, pistachios, walnuts, raisins, dates, seeds and festive gift hampers from Fatehpuri, Khari Baoli, Old Delhi. Wholesale and retail rates.',
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const CIRCULAR_CATEGORIES = [
  { name: 'Almonds', sub: '(Badam)', href: '/category/almonds', image: '/product-almonds.jpg' },
  { name: 'Cashews', sub: '(Kaju)', href: '/category/cashews', image: '/product-cashews.jpg' },
  { name: 'Pistachios', sub: '(Pista)', href: '/category/pistachios', image: '/product-pistachios.jpg' },
  { name: 'Walnuts', sub: '(Akhrot)', href: '/category/walnuts', image: '/product-walnuts.jpg' },
  { name: 'Raisins', sub: '(Kishmish)', href: '/category/raisins', image: '/product-raisins.jpg' },
  { name: 'Dates', sub: '(Khajoor)', href: '/category/dates', image: '/product-dates.jpg' },
  { name: 'Seeds', sub: '(Chia, Flax, Pumpkin)', href: '/category/seeds', image: '/product-seeds.jpg' },
  { name: 'Dry Fruit Mix', sub: '', href: '/category/dry-fruit-mix', image: '/product-mix.jpg' },
  { name: 'Gift Hampers', sub: '', href: '/category/gift-boxes', image: '/product-gift-hamper.jpg' },
  { name: 'Bulk Orders', sub: '', href: '/wholesale', image: '/banner-wholesale.jpg' },
];

const BESTSELLER_PRODUCTS: HomeProductItem[] = [
  { id: 'p-001', slug: 'kashmiri-mamra-almonds-500g', name: 'Kashmiri Mamra Almonds', imageUrl: '/product-almonds.jpg', variantLabel: '1 kg', pricePaise: 120000, mrpPaise: 150000, discountBadge: '10% OFF', rating: 4.8, reviewCount: 320, unitText: '(per kg)' },
  { id: 'p-002', slug: 'w240-cashews-500g', name: 'W320 Premium Cashews', imageUrl: '/product-cashews.jpg', variantLabel: '1 kg', pricePaise: 78000, mrpPaise: 98000, discountBadge: '20% OFF', rating: 4.7, reviewCount: 280, unitText: '(per kg)' },
  { id: 'p-003', slug: 'iranian-pistachios-250g', name: 'Iranian Green Pistachios', imageUrl: '/product-pistachios.jpg', variantLabel: '1 kg', pricePaise: 155000, mrpPaise: 190000, discountBadge: '18% OFF', rating: 4.8, reviewCount: 210, unitText: '(per kg)' },
  { id: 'p-004', slug: 'california-walnuts-1kg', name: 'California Walnuts', imageUrl: '/product-walnuts.jpg', variantLabel: '1 kg', pricePaise: 90000, mrpPaise: 110000, discountBadge: '18% OFF', rating: 4.6, reviewCount: 150, unitText: '(per kg)' },
  { id: 'p-005', slug: 'premium-raisins-1kg', name: 'Premium Raisins (Kishmish)', imageUrl: '/product-raisins.jpg', variantLabel: '1 kg', pricePaise: 40000, mrpPaise: 50000, discountBadge: '20% OFF', rating: 4.5, reviewCount: 180, unitText: '(per kg)' },
  { id: 'p-006', slug: 'ajwa-dates-1kg', name: 'Ajwa Premium Dates', imageUrl: '/product-dates.jpg', variantLabel: '1 kg', pricePaise: 85000, mrpPaise: 100000, discountBadge: '15% OFF', rating: 4.7, reviewCount: 120, unitText: '(per kg)' },
];

const WHY_CHOOSE_ITEMS = [
  { icon: <MandiArchIcon size={24} className="text-[#E5A93C]" />, title: 'Direct from', sub: 'Fatehpuri Mandi' },
  { icon: <ShieldCheckIcon size={24} className="text-[#E5A93C]" />, title: 'Premium Quality', sub: 'Lab Tested' },
  { icon: <VarietyBoxesIcon size={24} className="text-[#E5A93C]" />, title: 'Wide Variety', sub: '100+ Products' },
  { icon: <WholesaleDiscountIcon size={24} className="text-[#E5A93C]" />, title: 'Wholesale Rates', sub: 'for Businesses' },
  { icon: <DeliveryTruckIcon size={24} className="text-[#E5A93C]" />, title: 'Pan India Delivery', sub: 'Safe Packaging' },
  { icon: <TrustedCommunityIcon size={24} className="text-[#E5A93C]" />, title: 'Trusted by Thousands', sub: 'Since Generations' },
];

const INSTAGRAM_POSTS = [
  { image: '/product-almonds.jpg', alt: 'Fresh Kashmiri Almonds' },
  { image: '/product-cashews.jpg', alt: 'Premium Cashews W320' },
  { image: '/product-pistachios.jpg', alt: 'Iranian Pistachios' },
  { image: '/product-walnuts.jpg', alt: 'California Walnuts' },
  { image: '/product-dates.jpg', alt: 'Ajwa Premium Dates' },
  { image: '/product-mix.jpg', alt: 'Assorted Dry Fruit Mix' },
  { image: '/product-raisins.jpg', alt: 'Premium Raisins' },
  { image: '/product-figs.jpg', alt: 'Dried Afghan Figs' },
];

const BLOG_POSTS = [
  { title: 'Top 5 Healthy Dry Fruits to Include in Your Daily Diet', image: '/product-almonds.jpg', readTime: '5 min read', category: 'Health & Nutrition', href: '/blog/healthy-dry-fruits-daily-diet' },
  { title: 'Why Dry Fruit Hampers Make the Perfect Gift?', image: '/product-gift-hamper.jpg', readTime: '4 min read', category: 'Gifting Ideas', href: '/blog/dry-fruit-hampers-perfect-gift' },
];

// ─── Section Components ────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#101924]" aria-label="Hero Banner">
      <div className="relative w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[580px] flex items-center">
        <Image
          src="/hero-banner.jpg"
          alt="Bansal Foods premium dry fruits at historic Fatehpuri Mandi marketplace"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
        {/* Bottom fade on mobile */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none sm:hidden" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
          <div className="max-w-lg sm:max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
            <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#E5A93C] font-normal leading-none drop-shadow-sm">
              Premium Quality
            </p>
            <div className="space-y-0.5">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
                Dry Fruits &amp; Nuts
              </h1>
              <p className="font-serif italic text-xl sm:text-3xl lg:text-4xl text-[#E5A93C] font-normal leading-tight drop-shadow-sm">
                from Old Delhi&apos;s Historic Mandi
              </p>
            </div>
            <p className="text-white/90 text-xs sm:text-sm tracking-wide font-medium drop-shadow-sm">
              Authentic | Fresh | Pure | Wholesale &amp; Retail
            </p>

            {/* 2×2 on mobile, 4-col on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1 text-white">
              {[
                { Icon: WheatHarvestIcon, title: '100% Pure', sub: 'No Adulteration' },
                { Icon: MandiArchIcon, title: 'Direct from Mandi', sub: 'Best Prices' },
                { Icon: DeliveryTruckIcon, title: 'Pan India Delivery', sub: 'Safe & Fast' },
                { Icon: GenerationsTrustIcon, title: 'Trusted Since', sub: 'Generations' },
              ].map(({ Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E5A93C] flex items-center justify-center flex-shrink-0 bg-black/25">
                    <Icon size={14} className="text-[#E5A93C]" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] sm:text-[11px] font-bold">{title}</p>
                    <p className="text-[9px] sm:text-[10px] text-white/70">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/shop" id="hero-cta-shop"
                className="bg-[#E5A93C] hover:bg-[#D49826] text-[#1B1F2A] font-extrabold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm tracking-wide inline-flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRightIcon size={14} className="text-[#1B1F2A]" />
              </Link>
              <Link
                href="/about" id="hero-cta-story"
                className="bg-black/35 hover:bg-black/55 text-white border border-white/40 font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm tracking-wide inline-flex items-center gap-2 transition-all hover:border-white"
              >
                <PlayIcon size={10} className="text-white" />
                <span>Explore Our Story</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CircularCategoryStrip() {
  return (
    <section className="bg-white py-5 sm:py-8 border-b border-gray-100" aria-label="Quick Category Selector">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-4 text-center">
          {CIRCULAR_CATEGORIES.map((cat) => (
            <Link key={cat.name} href={cat.href} className="flex flex-col items-center group transition-transform hover:-translate-y-1">
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gray-200 bg-[#FAF7F2] shadow-2xs group-hover:border-[#C88C3C] group-hover:shadow-sm transition-all p-0.5 sm:p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 640px) 56px, 80px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <p className="font-bold text-[10px] sm:text-xs text-[#1B1F2A] mt-1.5 leading-tight group-hover:text-[#C88C3C] transition-colors">
                {cat.name}
              </p>
              {cat.sub ? <p className="text-[9px] text-gray-400 leading-none mt-0.5 hidden sm:block">{cat.sub}</p> : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DualPromoBanners() {
  return (
    <section className="py-5 sm:py-8 bg-white" aria-label="Promotional highlights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Festive Hampers */}
          <div className="rounded-2xl bg-[#F7EFE4] border border-[#EADBCA] p-5 sm:p-8 flex flex-row items-center justify-between gap-4 shadow-2xs overflow-hidden">
            <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#2A1810] leading-tight">
                Festive &amp; Gift Hampers
              </h2>
              <p className="text-xs text-[#5D4E42] leading-relaxed hidden sm:block">
                Beautifully packed dry fruit hampers for your loved ones
              </p>
              <Link href="/category/gift-boxes" className="bg-[#9E1B24] hover:bg-[#85141C] text-white text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-md inline-flex items-center gap-1.5 transition-colors shadow-2xs">
                <span>View Gift Hampers</span>
                <ArrowRightIcon size={13} />
              </Link>
            </div>
            <div className="relative w-28 h-28 sm:w-48 sm:h-40 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-white">
              <Image src="/banner-festive.jpg" alt="Festive dry fruits gift hamper" fill sizes="(max-width: 640px) 112px, 200px" className="object-cover" />
            </div>
          </div>

          {/* Wholesale */}
          <div className="rounded-2xl bg-[#EDE7DD] border border-[#DDD4C5] p-5 sm:p-8 flex flex-row items-center justify-between gap-4 shadow-2xs overflow-hidden">
            <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#1C202A] leading-tight">
                Wholesale Rates for Businesses
              </h2>
              <p className="text-xs text-[#525763] leading-relaxed hidden sm:block">
                Special pricing for retailers, caterers, corporate gifting and bulk orders.
              </p>
              <Link href="/wholesale" className="bg-[#0E1D3B] hover:bg-[#1A2E56] text-white text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-md inline-flex items-center gap-1.5 transition-colors shadow-2xs">
                <span>Get Wholesale Quote</span>
                <ArrowRightIcon size={13} />
              </Link>
            </div>
            <div className="relative w-28 h-28 sm:w-48 sm:h-40 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-white">
              <Image src="/banner-wholesale.jpg" alt="Bulk dry fruit wholesale sacks" fill sizes="(max-width: 640px) 112px, 200px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FreshHarvestFavorites() {
  return (
    <section className="py-5 sm:py-8 bg-white" aria-labelledby="harvest-favorites-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-row items-end justify-between mb-5 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A05E28] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A05E28]" />
              <span>BESTSELLERS</span>
            </div>
            <h2 id="harvest-favorites-heading" className="font-serif text-xl sm:text-3xl font-extrabold text-[#0B1B36]">
              Fresh Harvest Favorites
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Hand-picked, premium quality dry fruits packed with nutrition</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-[#0B1B36] hover:text-[#C88C3C] flex items-center gap-1 transition-colors whitespace-nowrap">
            View All <ArrowRightIcon size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {BESTSELLER_PRODUCTS.map((prod) => (
            <HomeProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="relative bg-[#21130D] text-white py-10 sm:py-14 my-4 sm:my-8 overflow-hidden" aria-label="Value Proposition">
      {/* Decorative side images (desktop only) */}
      <div className="absolute -left-12 top-0 bottom-0 w-36 sm:w-48 hidden lg:block pointer-events-none opacity-90">
        <div className="relative w-full h-full">
          <Image src="/product-almonds.jpg" alt="" fill sizes="200px" className="object-cover rounded-r-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#21130D]/40 to-[#21130D]" />
        </div>
      </div>
      <div className="absolute -right-12 top-0 bottom-0 w-36 sm:w-48 hidden lg:block pointer-events-none opacity-90">
        <div className="relative w-full h-full">
          <Image src="/product-dates.jpg" alt="" fill sizes="200px" className="object-cover rounded-l-full" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#21130D]/40 to-[#21130D]" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-white tracking-wide">
          Why Choose Bansal Foods?
        </h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-8 text-center">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#E5A93C]/40 flex items-center justify-center bg-black/25 group-hover:border-[#E5A93C] group-hover:bg-[#E5A93C]/10 group-hover:scale-110 transition-all shadow-inner">
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-white leading-tight">{item.title}</p>
                <p className="text-[9px] sm:text-[11px] text-white/70 leading-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <section className="py-7 sm:py-10 bg-white border-t border-gray-100" aria-label="Instagram Feed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1B1F2A] leading-none">Follow Us on Instagram</h2>
              <p className="text-[10px] text-gray-400">@bansalfoods</p>
            </div>
          </div>
          <a href="https://instagram.com/bansalfoods" target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold text-[#C88C3C] hover:underline flex items-center gap-1">
            See All <ArrowRightIcon size={11} />
          </a>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
          {INSTAGRAM_POSTS.map((post, i) => (
            <a key={i} href="https://instagram.com/bansalfoods" target="_blank" rel="noopener noreferrer"
              className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden group">
              <Image src={post.image} alt={post.alt} fill sizes="(max-width: 640px) 25vw, 12.5vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestBlogSection() {
  return (
    <section className="py-7 sm:py-10 bg-[#FAF7F2] border-t border-gray-100" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A05E28] mb-0.5">OUR BLOG</p>
            <h2 id="blog-heading" className="font-serif text-xl sm:text-2xl font-extrabold text-[#0B1B36]">Latest from Our Blog</h2>
          </div>
          <Link href="/blog" className="text-xs font-bold text-[#0B1B36] hover:text-[#C88C3C] flex items-center gap-1 transition-colors">
            See All <ArrowRightIcon size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {BLOG_POSTS.map((post) => (
            <Link key={post.href} href={post.href}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-sm transition-shadow group flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 bg-[#FAF7F2]">
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 640px) 100vw, 160px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 bg-[#E5A93C] text-[#1B1F2A] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="font-bold text-sm text-[#1B1F2A] leading-snug group-hover:text-[#C88C3C] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {post.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Export ──────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CircularCategoryStrip />
      <DualPromoBanners />
      <FreshHarvestFavorites />
      <WhyChooseSection />
      <CustomerReviewsClient />
      <InstagramSection />
      <LatestBlogSection />
      <NewsletterClient />
    </>
  );
}
