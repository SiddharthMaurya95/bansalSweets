import { getDb } from '../client';
import {
  products,
  productVariants,
  categories,
  productCategories,
  inventoryItems,
  inventoryLocations,
  inventoryTransactions,
} from '../schema/index';
import { eq } from 'drizzle-orm';

/**
 * Synthetic Development / Staging Catalog Seed Generator
 * RULE: MUST flag all synthetic catalog data with `is_seed = true`.
 * These items will be strictly blocked from production deployment by seedGuard.
 */
export async function runDevSeed(): Promise<void> {
  const db = getDb();
  console.log('🧪 Starting Synthetic Development Seed...');

  // 1. Fetch Location and Categories
  const [location] = await db.select().from(inventoryLocations).limit(1);
  if (!location) {
    throw new Error('Default inventory location not found. Run production seed first.');
  }

  const catRows = await db.select().from(categories);
  const catMap = new Map(catRows.map((c) => [c.slug, c.id]));

  const sampleProducts = [
    {
      name: 'Premium California Almonds (Badam Giri)',
      slug: 'premium-california-almonds',
      categorySlug: 'almonds',
      hsnCode: '08021200',
      taxRateBps: 500, // 5%
      shortDescription: 'Crunchy, sweet California Nonpareil almonds packed with vitamin E.',
      variants: [
        { label: '250 g', sku: 'ALM-CAL-250G', weight: 250, mrp: 35000, price: 29900, stock: 40 },
        { label: '500 g', sku: 'ALM-CAL-500G', weight: 500, mrp: 68000, price: 58000, stock: 50 },
        { label: '1 kg', sku: 'ALM-CAL-1KG', weight: 1000, mrp: 130000, price: 110000, stock: 30 },
      ],
    },
    {
      name: 'Royal W240 King Cashews (Kaju)',
      slug: 'royal-w240-king-cashews',
      categorySlug: 'cashews',
      hsnCode: '08013210',
      taxRateBps: 500,
      shortDescription: 'Giant whole grade W-240 white cashews from Mangalore/Goa.',
      variants: [
        { label: '250 g', sku: 'CSH-W240-250G', weight: 250, mrp: 42000, price: 34900, stock: 35 },
        { label: '500 g', sku: 'CSH-W240-500G', weight: 500, mrp: 82000, price: 68000, stock: 45 },
        { label: '1 kg', sku: 'CSH-W240-1KG', weight: 1000, mrp: 160000, price: 132000, stock: 20 },
      ],
    },
    {
      name: 'Iranian Roasted Salted Pistachios (Pista)',
      slug: 'iranian-roasted-salted-pistachios',
      categorySlug: 'pistachios',
      hsnCode: '08025100',
      taxRateBps: 500,
      shortDescription: 'Naturally opened jumbo Iranian pistachios lightly roasted with pink salt.',
      variants: [
        { label: '250 g', sku: 'PST-IRN-250G', weight: 250, mrp: 48000, price: 39900, stock: 30 },
        { label: '500 g', sku: 'PST-IRN-500G', weight: 500, mrp: 94000, price: 77500, stock: 25 },
      ],
    },
    {
      name: 'Kashmiri Snow White Walnut Kernels (Akhrot Giri)',
      slug: 'kashmiri-walnut-kernels',
      categorySlug: 'walnuts',
      hsnCode: '08023200',
      taxRateBps: 500,
      shortDescription:
        'Extra light quarter and half walnut kernels harvested fresh from Kashmir valleys.',
      variants: [
        { label: '250 g', sku: 'WLN-KSH-250G', weight: 250, mrp: 45000, price: 36000, stock: 25 },
        { label: '500 g', sku: 'WLN-KSH-500G', weight: 500, mrp: 88000, price: 69900, stock: 30 },
      ],
    },
    {
      name: 'Fatehpuri Royal Festive 4-in-1 Dry Fruit Gift Box',
      slug: 'fatehpuri-royal-festive-gift-box',
      categorySlug: 'gift-packs',
      hsnCode: '08029000',
      taxRateBps: 1200, // 12% for gift pack combo
      shortDescription:
        'Luxurious wooden partitioned gift box containing Almonds, Cashews, Pistachios, and Raisins.',
      variants: [
        {
          label: '1 kg (4x250g)',
          sku: 'GFT-ROYAL-1KG',
          weight: 1000,
          mrp: 180000,
          price: 149900,
          stock: 20,
        },
      ],
    },
  ];

  for (const item of sampleProducts) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, item.slug))
      .limit(1);

    if (existing.length > 0) continue;

    // Insert Product (SYNTHETIC: isSeed = true)
    const [prod] = await db
      .insert(products)
      .values({
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: `${item.name} - Hand-sorted and traditionally graded at Fatehpuri, Old Delhi.`,
        status: 'ACTIVE',
        isFeatured: true,
        hsnCode: item.hsnCode,
        taxRateBps: item.taxRateBps,
        isSeed: true, // MANDATORY FLAG
        minPricePaise: Math.min(...item.variants.map((v) => v.price)),
        maxPricePaise: Math.max(...item.variants.map((v) => v.price)),
        inStock: true,
      })
      .returning({ id: products.id });

    if (!prod) continue;

    // Link Primary Category
    const categoryId = catMap.get(item.categorySlug);
    if (categoryId) {
      await db.insert(productCategories).values({
        productId: prod.id,
        categoryId,
        isPrimary: true,
      });
    }

    // Insert Variants and Inventory
    let isFirst = true;
    for (const v of item.variants) {
      const [variant] = await db
        .insert(productVariants)
        .values({
          productId: prod.id,
          sku: v.sku,
          label: v.label,
          weightGrams: v.weight,
          mrpPaise: v.mrp,
          pricePaise: v.price,
          isDefault: isFirst,
          isActive: true,
        })
        .returning({ id: productVariants.id });

      isFirst = false;

      if (variant) {
        // Create Inventory Item
        const [invItem] = await db
          .insert(inventoryItems)
          .values({
            locationId: location.id,
            productId: prod.id,
            variantId: variant.id,
            stockUnit: 'UNIT',
            onHandQty: v.stock,
            reservedQty: 0,
            onlineBufferQty: 2, // Hold 2 units back for counter sales
            lowStockThreshold: 5,
          })
          .returning({ id: inventoryItems.id });

        if (invItem) {
          // Log initial transaction in immutable ledger
          await db.insert(inventoryTransactions).values({
            inventoryItemId: invItem.id,
            type: 'RECEIPT',
            deltaOnHand: v.stock,
            deltaReserved: 0,
            onHandAfter: v.stock,
            reservedAfter: 0,
            reasonCode: 'INITIAL_DEV_SEED',
            note: 'Initial synthetic stock for development',
          });
        }
      }
    }
  }

  console.log('✅ Synthetic Development Seed Completed.');
}
