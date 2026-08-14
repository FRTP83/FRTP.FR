import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { getNewsForSite, getStudioSettings } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Actualités et publications de FRTP, entreprise de travaux publics à Fréjus."
};

export default async function NewsPage() {
  const [news, studio] = await Promise.all([getNewsForSite(), getStudioSettings()]);

  return (
    <section className="invert-site bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Actualites & chantiers"
          title={studio.newsPageTitle}
          text={studio.newsPageText}
        />
        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
          {news.map((item) => (
            <Link data-gsap key={item.slug} href={`/actualites/${item.slug}`} className="group block border border-zinc-200 bg-frtp-gray p-5 transition hover:border-frtp-orange md:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-frtp-blue md:text-xs md:tracking-[0.24em]">Actualite</p>
              <h2 className="mt-4 text-xl font-black text-zinc-950 md:text-2xl">{item.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600 md:text-base">{item.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-frtp-orange">
                Lire l'actualite <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
