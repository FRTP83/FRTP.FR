import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getNewsForSite, getStudioSettings, type SiteNews } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Informations et archives de l’entreprise de travaux publics FRTP",
  description: "Informations de l’entreprise FRTP et archives des annonces publiées. Retrouvez aussi nos réalisations de travaux publics dans le Var et les Alpes-Maritimes.",
  path: "/actualites"
});

export default async function NewsPage() {
  const [news, studio] = await Promise.all([getNewsForSite(), getStudioSettings()]);
  const currentNews = news.filter(item => !item.is_archived);
  const archivedNews = news.filter(item => item.is_archived);

  return (
    <section className="news-index-page bg-frtp-mist">
      <div className="dark-panel px-4 pb-14 pt-12 text-white md:px-6 md:pb-20 md:pt-18">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 md:text-xs md:tracking-[0.24em]">Informations FRTP</p>
          <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
            {studio.newsPageTitle}
          </h1>
          {studio.newsPageText ? (
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-zinc-300 md:text-xl">
              {studio.newsPageText}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          {currentNews.length ? <NewsCards items={currentNews} /> : (
            <div className="border-l-4 border-frtp-orange bg-white p-6 md:p-8">
              <p className="text-base leading-7 text-zinc-700">Consultez nos réalisations pour voir les travaux et les photos des chantiers.</p>
              <Link href="/realisations" className="mt-4 inline-flex items-center gap-2 font-bold text-frtp-blue">
                Voir nos chantiers <ArrowRight size={17} />
              </Link>
            </div>
          )}
          {archivedNews.length ? (
            <div className="mt-10 md:mt-14">
              <h2 className="mb-6 font-display text-3xl font-bold text-zinc-950">Archives</h2>
              <NewsCards items={archivedNews} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function NewsCards({ items }: { items: SiteNews[] }) {
  return (
    <div className="news-index-grid">
          {items.map((item) => (
            <Link
              data-gsap
              key={item.slug}
              href={`/actualites/${item.slug}`}
              className="news-index-card group"
            >
              <span className="news-index-card-top">
                <span>{item.is_archived ? "Archive" : "Actualité"}</span>
                {item.created_at ? (
                  <span>
                    <CalendarDays size={14} />
                    {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(item.created_at))}
                  </span>
                ) : null}
              </span>
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
              <span className="news-index-link">
                {item.is_archived ? "Lire l’archive" : "Lire l’actualité"} <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
    </div>
  );
}
