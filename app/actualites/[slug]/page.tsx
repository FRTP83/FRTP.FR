import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { RichText } from "@/components/RichText";
import { getNewsForSite } from "@/lib/server-data";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  if (!item) {
    return { title: "Actualité" };
  }

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/actualites/${item.slug}` },
    openGraph: {
      title: `${item.title} | FRTP`,
      description: item.excerpt,
      url: `/actualites/${item.slug}`,
      images: item.cover_image_url ? [{ url: item.cover_image_url }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | FRTP`,
      description: item.excerpt,
      images: item.cover_image_url ? [item.cover_image_url] : ["/chantier/horizon-hero.jpeg"]
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
    <article className="bg-frtp-mist text-frtp-graphite">
      <header className="dark-panel px-4 py-12 text-white md:px-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link href="/actualites" className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-frtp-orange">
            <ArrowLeft size={17} />
            Retour aux actualités
          </Link>

          <div className="mt-8">
            <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 md:text-xs md:tracking-[0.24em]">Actualité FRTP</p>
            <h1 className="mt-4 max-w-4xl font-display text-[2.3rem] font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
              {item.title}
            </h1>
            {dateLabel ? (
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-zinc-200">
                <CalendarDays size={17} />
                {dateLabel}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="border-t-4 border-frtp-blue bg-white p-5 shadow-technical md:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-frtp-orange">En bref</p>
            <p className="mt-4 text-[15px] font-semibold leading-7 text-zinc-600">{item.excerpt}</p>
          </aside>

          <div>
            {item.cover_image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-200 shadow-technical">
                <Image src={item.cover_image_url} alt={item.title} fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" priority />
              </div>
            ) : null}

            <RichText content={content} className="mt-8 max-w-none bg-white p-5 text-zinc-700 shadow-technical md:p-7" />
          </div>
        </div>
      </div>
    </article>
  );
}

async function getNewsItem(slug: string) {
  const news = await getNewsForSite();
  return news.find((item) => item.slug === slug) ?? null;
}
