import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { getNewsForSite, getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Actualités",
  description: "Actualités et publications de FRTP, entreprise de travaux publics à Fréjus."
};

export default async function NewsPage() {
  const [news, studio] = await Promise.all([getNewsForSite(), getStudioSettings()]);

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Actualites & chantiers"
          title={studio.newsPageTitle}
          text={studio.newsPageText}
        />
        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
          {news.map((item) => (
            <article data-gsap key={item.slug} className="border border-zinc-200 bg-frtp-gray p-5 md:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-frtp-blue md:text-xs md:tracking-[0.24em]">Actualite</p>
              <h2 className="mt-4 text-xl font-black text-zinc-950 md:text-2xl">{item.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600 md:text-base">{item.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
