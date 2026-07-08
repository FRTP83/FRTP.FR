"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type GalleryImage = {
  url: string;
  type: string;
};

type GalleryLightboxProps = {
  images: GalleryImage[];
  title: string;
};

const typeLabels: Record<string, string> = {
  before: "Avant",
  during: "Pendant",
  after: "Apres",
  gallery: "Galerie"
};

export function GalleryLightbox({ images, title }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activePosition = activeIndex === null ? 0 : activeIndex + 1;
  const hasNavigation = images.length > 1;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === null ? current : (current - 1 + images.length) % images.length));
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? current : (current + 1) % images.length));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current === null ? current : (current - 1 + images.length) % images.length));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === null ? current : (current + 1) % images.length));
  };

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-6 md:grid-cols-3 md:gap-4">
        {images.map((image, index) => (
          <button
            key={image.url + index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden bg-zinc-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-frtp-orange focus-visible:ring-offset-2"
            aria-label={`Agrandir la photo ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={`${title} ${typeLabels[image.type] ?? image.type} ${index + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-zinc-950/0 transition group-hover:bg-zinc-950/35" />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-frtp-blue opacity-0 shadow-lg transition group-hover:opacity-100">
              <Maximize2 size={14} />
              Agrandir
            </span>
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 px-4 py-5 text-white backdrop-blur-sm md:px-8 md:py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo agrandie"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null);
            }
          }}
        >
          <div className="absolute left-4 top-4 z-10 max-w-[calc(100%-5rem)] md:left-8 md:top-7">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-frtp-orange">
              {typeLabels[activeImage.type] ?? activeImage.type}
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-black md:text-base">{title}</p>
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
              src={activeImage.url}
              alt={`${title} ${typeLabels[activeImage.type] ?? activeImage.type} ${activePosition}`}
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
            {activePosition} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
