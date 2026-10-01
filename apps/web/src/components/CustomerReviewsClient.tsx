'use client';

import React, { useState, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@/components/ThemeIcons';

const TESTIMONIALS = [
  { name: 'Ravi Sharma', role: 'Delhi', initial: 'R', text: 'The quality of almonds and cashews is excellent. Fresh and genuine products at the best prices. Highly recommended!', rating: 5 },
  { name: 'Priya Mehta', role: 'Noida', initial: 'P', text: 'Best dry fruits shop in Fatehpuri! Authentic products and very supportive staff. I have been ordering for 3 years now.', rating: 5 },
  { name: 'Anil Gupta', role: 'Restaurant Owner, Delhi', initial: 'A', text: 'Great wholesale rates and timely delivery. Quality is always consistent. Trusted supplier for our business.', rating: 5 },
];

export function CustomerReviewsClient() {
  const [current, setCurrent] = useState(0);
  const prev = useCallback(() => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1)), []);
  const next = useCallback(() => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1)), []);

  return (
    <section className="py-10 sm:py-12 bg-[#FAF7F2]" aria-labelledby="customer-reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A05E28] mb-1">CUSTOMER REVIEWS</p>
          <h2 id="customer-reviews-heading" className="font-serif text-xl sm:text-3xl font-extrabold text-[#0B1B36]">
            What Our Customers Say
          </h2>
          <p className="text-xs text-gray-500 mt-1">Real feedback from our valued customers</p>
        </div>

        {/* Mobile: single card carousel */}
        <div className="block sm:hidden">
          {(() => {
            const t = TESTIMONIALS[current] ?? TESTIMONIALS[0]!;
            return (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-0.5 text-[#E5A93C] mb-3">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <StarIcon key={i} size={14} filled className="text-[#E5A93C]" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#8A95A5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#0B1B36]">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="flex justify-center gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${i === current ? 'bg-[#C88C3C] w-5' : 'bg-gray-300 w-2'}`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-column with arrows */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button" onClick={prev}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 shadow-2xs cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeftIcon size={16} className="text-gray-700" />
          </button>

          <div className="grid grid-cols-3 gap-5 flex-1">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-0.5 text-[#E5A93C] mb-3">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <StarIcon key={i} size={14} filled className="text-[#E5A93C]" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic mb-4">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#8A95A5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#0B1B36]">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button" onClick={next}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 shadow-2xs cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRightIcon size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
