"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
        title: "Avant / apres",
        city: "",
        category: "",
        before: fallbackBefore,
        after: fallbackAfter,
        sortOrder: 0,
        isPublished: true
      }];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 md:gap-4" aria-live="polite">
        <figure className="group relative overflow-hidden bg-zinc-200">
          <Image
            key={`${activeSlide.id}-before`}
            src={activeSlide.before}
            alt={`${activeSlide.title} avant travaux`}
            width={560}
            height={700}
            className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          <figcaption className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-frtp-blue shadow-technical">
            Avant
          </figcaption>
        </figure>
        <figure className="group relative mt-6 overflow-hidden bg-zinc-200 md:mt-10">
          <Image
            key={`${activeSlide.id}-after`}
            src={activeSlide.after}
            alt={`${activeSlide.title} apres travaux`}
            width={560}
            height={700}
            className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
          <figcaption className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-frtp-orange shadow-technical">
            Apres
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
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={index === activeIndex ? "h-2.5 w-8 bg-frtp-orange" : "h-2.5 w-2.5 bg-zinc-300 transition hover:bg-frtp-blue"}
                aria-label={`Afficher la comparaison ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
