import React from 'react';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': 'https://bansalfoods.in/#organization',
    name: 'Bansal Foods',
    alternateName: ['Bansal Dry Fruits', 'Bansal Foods Khari Baoli'],
    url: 'https://bansalfoods.in',
    logo: 'https://bansalfoods.in/logo.png',
    image: 'https://bansalfoods.in/og-image.jpg',
    description:
      'Premier wholesale and retail merchant of authentic Kashmiri Mamra almonds, W320 cashews, Afghan pistachios, walnuts, raisins, dates, and festive gift hampers located in the historic Khari Baoli spice & dry fruits mandi of Old Delhi.',
    telephone: '+919313321535',
    email: 'shashwatbansal2610@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking, COD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 12, Main Mandi, Khari Baoli, Chandni Chowk',
      addressLocality: 'Old Delhi',
      addressRegion: 'Delhi',
      postalCode: '110006',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.6562,
      longitude: 77.2227,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '19:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:30',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://instagram.com/bansal_dryfruits',
      'https://wa.me/919313321535',
      'https://google.com/maps/place/Bansal+dairy+%26+dry+fruits/data=!4m2!3m1!1s0x0:0x89de043e19cbb404?sa=X&ved=1t:2428&ictx=111',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://bansalfoods.in/#website',
    url: 'https://bansalfoods.in',
    name: 'Bansal Foods',
    description:
      'Buy authentic dry fruits, almonds, cashews, pistachios, walnuts, raisins and dates from Khari Baoli, Old Delhi.',
    publisher: {
      '@id': 'https://bansalfoods.in/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bansalfoods.in/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbsJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith('http') ? it.item : `https://bansalfoods.in${it.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ProductJsonLdProps {
  name: string;
  description: string;
  slug: string;
  images: string[];
  sku: string;
  pricePaise: number;
  inStock?: boolean;
  ratingValue?: number;
  reviewCount?: number;
}

export function ProductJsonLd({
  name,
  description,
  slug,
  images,
  sku,
  pricePaise,
  inStock = true,
  ratingValue = 4.9,
  reviewCount = 124,
}: ProductJsonLdProps) {
  const url = `https://bansalfoods.in/products/${slug}`;
  const priceRupees = (pricePaise / 100).toFixed(2);
  const formattedImages = images.map((img) =>
    img.startsWith('http') ? img : `https://bansalfoods.in${img}`,
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: formattedImages,
    sku,
    mpn: sku,
    brand: {
      '@type': 'Brand',
      name: 'Bansal Foods',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: priceRupees,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Bansal Foods',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleJsonLdProps {
  headline: string;
  description: string;
  slug: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export function ArticleJsonLd({
  headline,
  description,
  slug,
  imageUrl,
  datePublished,
  dateModified,
  authorName = 'Bansal Foods Nutrition Team',
}: ArticleJsonLdProps) {
  const url = `https://bansalfoods.in/blog/${slug}`;
  const img = imageUrl.startsWith('http') ? imageUrl : `https://bansalfoods.in${imageUrl}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: img,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bansal Foods',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bansalfoods.in/logo.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
