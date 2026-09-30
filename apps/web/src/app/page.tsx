export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl bg-surface-warm border border-brand-gold-300/40 rounded-card p-8 shadow-sm">
        <span className="inline-block px-3 py-1 bg-brand-gold-500/20 text-brand-blue-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          Fatehpuri, Delhi • Est. Tradition
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-blue-900 mb-3">
          BANSAL FOODS
        </h1>
        <p className="text-ink-600 mb-6 text-sm sm:text-base leading-relaxed">
          Premium dry fruits, artisanal nut mixes, and festive gifting collections directly from the
          heart of Old Delhi&apos;s historic dry fruit market.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/shop"
            className="px-6 py-2.5 bg-brand-blue-900 hover:bg-brand-blue-700 text-white rounded-md font-medium text-sm transition-colors shadow-sm"
          >
            Explore Catalog
          </a>
          <a
            href="/bulk-enquiry"
            className="px-6 py-2.5 bg-white border border-brand-blue-900/30 hover:border-brand-blue-900 text-brand-blue-900 rounded-md font-medium text-sm transition-colors"
          >
            Wholesale & Bulk
          </a>
        </div>
      </div>
    </main>
  );
}
