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
  label: "Avant" | "Apres";
  title: string;
  city: string;
  category: string;
};

export function BeforeAfterLightboxList({ pairs }: BeforeAfterLightboxListProps) {
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
        label: "Apres",
        title: pair.title,
        city: pair.city,
        category: pair.category
      }
    ]),
    [pairs]
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
      <div className="mt-8 grid gap-6 md:mt-12 md:gap-8">
        {pairs.map((pair) => {
          const beforeIndex = photos.findIndex((photo) => photo.id === `${pair.id}-before`);
          const afterIndex = photos.findIndex((photo) => photo.id === `${pair.id}-after`);

          return (
            <article key={pair.id} className="border border-zinc-200 bg-frtp-gray p-4 md:p-6">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-frtp-orange md:text-xs md:tracking-[0.24em]">{pair.category}</p>
                  <h2 className="mt-2 text-xl font-black text-zinc-950 md:text-2xl">{pair.title}</h2>
                  <p className="mt-1 font-semibold text-zinc-600">{pair.city}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-4">
                <PhotoButton label="Avant" src={pair.before} title={pair.title} onOpen={() => setActiveIndex(beforeIndex)} />
                <PhotoButton label="Apres" src={pair.after} title={pair.title} onOpen={() => setActiveIndex(afterIndex)} />
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
          aria-label="Photo avant apres agrandie"
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

function PhotoButton({ label, src, title, onOpen }: { label: "Avant" | "Apres"; src: string; title: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[16/10] overflow-hidden bg-zinc-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-frtp-orange focus-visible:ring-offset-2"
      aria-label={`Agrandir la photo ${label.toLowerCase()}`}
    >
      <Image src={src} alt={`${label} - ${title}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
      <span className="absolute inset-0 bg-zinc-950/0 transition group-hover:bg-zinc-950/25" />
      <span className="absolute left-4 top-4 bg-zinc-950 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
        {label}
      </span>
      <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-frtp-blue opacity-0 shadow-lg transition group-hover:opacity-100">
        <Maximize2 size={14} />
        Agrandir
      </span>
    </button>
  );
}
