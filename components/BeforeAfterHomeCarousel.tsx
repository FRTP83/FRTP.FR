"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BeforeAfterItem } from "@/lib/before-after";

type BeforeAfterHomeCarouselProps = {
  items: BeforeAfterItem[];
  fallbackBefore: string;
  fallbackAfter: string;
};

export function BeforeAfterHomeCarousel({ items, fallbackBefore, fallbackAfter }: BeforeAfterHomeCarouselProps) {
  const slides = items.length
    ? items
    : [{
        id: "fallback",
        title: "Avant / après",
        city: "",
        category: "",
        before: fallbackBefore,
        after: fallbackAfter,
        sortOrder: 0,
        isPublished: true
      }];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeSlide = slides[activeIndex] ?? slides[0];

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  useEffect(() => {
    if (slides.length < 2 || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <div
      className="grid gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) < 50 || slides.length < 2) return;
        if (distance > 0) showPrevious();
        else showNext();
      }}
    >
      <div className="grid grid-cols-2 gap-3 md:gap-4" aria-live="polite">
        <figure className="group relative overflow-hidden bg-transparent leading-none">
          <Image
            key={`${activeSlide.id}-before`}
            src={activeSlide.before}
            alt={`${activeSlide.title} avant travaux`}
            width={560}
            height={700}
            className="block aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          <figcaption className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-frtp-blue shadow-technical">
            Avant
          </figcaption>
        </figure>
        <figure className="group relative mt-6 overflow-hidden bg-transparent leading-none md:mt-10">
          <Image
            key={`${activeSlide.id}-after`}
            src={activeSlide.after}
            alt={`${activeSlide.title} après travaux`}
            width={560}
            height={700}
            className="block aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          <figcaption className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-frtp-orange shadow-technical">
            Après
          </figcaption>
        </figure>
      </div>

      <div className="flex flex-col justify-between gap-3 border-l-4 border-frtp-orange bg-white px-4 py-3 shadow-technical sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black text-zinc-950">{activeSlide.title}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {[activeSlide.city, activeSlide.category].filter(Boolean).join(" - ")}
          </p>
        </div>
        {slides.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              className="inline-flex h-11 w-11 items-center justify-center border border-zinc-200 text-frtp-blue transition hover:border-frtp-blue hover:bg-frtp-blue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frtp-orange"
              aria-label="Afficher la comparaison précédente"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <span className="min-w-16 text-center font-mono text-xs font-black tabular-nums text-zinc-600" aria-live="polite">
              {activeIndex + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={showNext}
              className="inline-flex h-11 w-11 items-center justify-center border border-zinc-200 text-frtp-blue transition hover:border-frtp-blue hover:bg-frtp-blue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frtp-orange"
              aria-label="Afficher la comparaison suivante"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
