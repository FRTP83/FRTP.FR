"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { BeforeAfterItem } from "@/lib/before-after";

type BeforeAfterLightboxListProps = {
  pairs: BeforeAfterItem[];
};

type LightboxPhoto = {
  id: string;
  src: string;
  label: "Avant" | "Après";
  title: string;
  city: string;
  category: string;
};

export function BeforeAfterLightboxList({ pairs }: BeforeAfterLightboxListProps) {
  const [activeCategory, setActiveCategory] = useState("__all__");
  const photos = useMemo<LightboxPhoto[]>(
    () => pairs.flatMap((pair) => [
      {
        id: `${pair.id}-before`,
        src: pair.before,
        label: "Avant",
        title: pair.title,
        city: pair.city,
        category: pair.category
      },
      {
        id: `${pair.id}-after`,
        src: pair.after,
        label: "Après",
        title: pair.title,
        city: pair.city,
        category: pair.category
      }
    ]),
    [pairs]
  );
  const categoryCounts = useMemo(
    () => Array.from(
      pairs.reduce((map, pair) => {
        map.set(pair.category, (map.get(pair.category) ?? 0) + 1);
        return map;
      }, new Map<string, number>())
    ),
    [pairs]
  );
  const visiblePairs = useMemo(
    () => activeCategory === "__all__" ? pairs : pairs.filter((pair) => pair.category === activeCategory),
    [activeCategory, pairs]
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];
  const activePosition = activeIndex === null ? 0 : activeIndex + 1;
  const hasNavigation = photos.length > 1;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === null ? current : (current - 1 + photos.length) % photos.length));
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, photos.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current === null ? current : (current - 1 + photos.length) % photos.length));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length));
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`projects-index-filter ${activeCategory === "__all__" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("__all__")}
          aria-pressed={activeCategory === "__all__"}
        >
          Toutes les comparaisons <small>{pairs.length}</small>
        </button>
        {categoryCounts.map(([category, count]) => (
          <button
            key={category}
            type="button"
            className={`projects-index-filter ${activeCategory === category ? "is-active" : ""}`}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category} <small>{count}</small>
          </button>
        ))}
      </div>

      <div className="before-after-index-grid mt-8 md:mt-12">
        {visiblePairs.map((pair) => {
          const beforeIndex = photos.findIndex((photo) => photo.id === `${pair.id}-before`);
          const afterIndex = photos.findIndex((photo) => photo.id === `${pair.id}-after`);

          return (
            <article key={pair.id} className="before-after-index-card">
              <div className="before-after-index-photos">
                <PhotoButton label="Avant" src={pair.before} title={pair.title} onOpen={() => setActiveIndex(beforeIndex)} />
                <PhotoButton label="Après" src={pair.after} title={pair.title} onOpen={() => setActiveIndex(afterIndex)} />
              </div>
              <div className="before-after-index-caption">
                <p>{pair.title}</p>
                <span>{pair.city} - {pair.category}</span>
              </div>
            </article>
          );
        })}
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 px-4 py-5 text-white backdrop-blur-sm md:px-8 md:py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo avant après agrandie"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null);
            }
          }}
        >
          <div className="absolute left-4 top-4 z-10 max-w-[calc(100%-5rem)] md:left-8 md:top-7">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-frtp-orange">{activePhoto.label}</p>
            <p className="mt-1 line-clamp-2 text-sm font-black md:text-base">{activePhoto.title}</p>
            <p className="mt-1 text-xs font-semibold text-white/65">{activePhoto.city} - {activePhoto.category}</p>
          </div>

          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center bg-white text-zinc-950 transition hover:bg-frtp-orange hover:text-white md:right-8 md:top-7"
            aria-label="Fermer la photo agrandie"
          >
            <X size={22} />
          </button>

          {hasNavigation ? (
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-4 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center bg-white/95 text-zinc-950 transition hover:bg-frtp-orange hover:text-white md:left-8 md:size-12"
              aria-label="Photo precedente"
            >
              <ChevronLeft size={26} />
            </button>
          ) : null}

          <div className="relative h-[72dvh] w-full max-w-6xl md:h-[78dvh]">
            <Image
              src={activePhoto.src}
              alt={`${activePhoto.label} - ${activePhoto.title}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {hasNavigation ? (
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center bg-white/95 text-zinc-950 transition hover:bg-frtp-orange hover:text-white md:right-8 md:size-12"
              aria-label="Photo suivante"
            >
              <ChevronRight size={26} />
            </button>
          ) : null}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-[0.18em] text-white/70 md:bottom-7">
            {activePosition} / {photos.length}
          </p>
        </div>
      ) : null}
    </>
  );
}

function PhotoButton({ label, src, title, onOpen }: { label: "Avant" | "Après"; src: string; title: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="before-after-photo-button group"
      aria-label={`Agrandir la photo ${label.toLowerCase()}`}
    >
      <Image src={src} alt={`${label} - ${title}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
      <span className="before-after-photo-shade" />
      <span className="before-after-photo-label">
        {label}
      </span>
      <span className="before-after-photo-zoom">
        <Maximize2 size={14} />
        Agrandir
      </span>
    </button>
  );
}
