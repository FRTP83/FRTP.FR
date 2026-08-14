import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { RichText } from "@/components/RichText";
import { getNewsForSite } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  if (!item) {
    return { title: "Actualite" };
  }

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/actualites/${item.slug}` },
    openGraph: {
      title: `${item.title} | FRTP`,
      description: item.excerpt,
      images: item.cover_image_url ? [{ url: item.cover_image_url }] : undefined
    }
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  if (!item) {
    notFound();
  }

  const dateLabel = item.created_at
    ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.created_at))
    : null;
  const content = item.content?.trim() || item.excerpt;

  return (
    <article className="invert-site bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/actualites" className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-frtp-orange">
          <ArrowLeft size={17} />
          Retour aux actualites
        </Link>

        <header className="mt-8">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-blue md:text-xs md:tracking-[0.24em]">Actualite</p>
          <h1 className="mt-4 max-w-4xl font-display text-[2.3rem] font-bold leading-[1.02] tracking-tight text-frtp-graphite md:text-6xl">
            {item.title}
          </h1>
          {dateLabel ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-zinc-600">
              <CalendarDays size={17} />
              {dateLabel}
            </p>
          ) : null}
        </header>

        {item.cover_image_url ? (
          <div className="relative mt-8 aspect-[16/8] overflow-hidden border border-zinc-200 md:mt-10">
            <Image src={item.cover_image_url} alt={item.title} fill sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" priority />
          </div>
        ) : null}

        <RichText content={content} className="mt-8 max-w-3xl md:mt-10" />
      </div>
    </article>
  );
}

async function getNewsItem(slug: string) {
  const news = await getNewsForSite();
  return news.find((item) => item.slug === slug) ?? null;
}
