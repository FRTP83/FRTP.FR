import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { activities } from "@/lib/data";
import { SectionHeading } from "@/components/SectionHeading";
import { StructuredData } from "@/components/StructuredData";
import { getActivitiesForSite, getProjectsForSite } from "@/lib/server-data";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/structured-data";
import { categoryMatchesActivity } from "@/lib/project-categories";
import { activitySeoContent } from "@/lib/seo-content";

export const revalidate = 60;

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const siteActivities = await getActivitiesForSite();
  const activity = siteActivities.find((item) => item.slug === slug);

  if (!activity) {
    return { title: "Activité" };
  }

  return {
    title: `${activity.title} à Fréjus et dans le Var`,
    description: `${activity.description} FRTP intervient à Fréjus, dans le Var et les Alpes-Maritimes.`,
    alternates: { canonical: `/activites/${activity.slug}` },
    openGraph: {
      title: `${activity.title} | FRTP`,
      description: activity.description,
      url: `/activites/${activity.slug}`,
      images: [{ url: "/chantier/horizon-hero.jpeg", alt: `${activity.title} - FRTP` }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${activity.title} | FRTP`,
      description: activity.description,
      images: ["/chantier/horizon-hero.jpeg"]
    }
  };
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [siteActivities, projects] = await Promise.all([getActivitiesForSite(), getProjectsForSite()]);
  const activity = siteActivities.find((item) => item.slug === slug);

  if (!activity) {
    notFound();
  }

  const Icon = activity.icon;
  const seoContent = activitySeoContent[activity.slug];
  const related = projects.filter((project) =>
    project.categories.some((category) => categoryMatchesActivity(category, activity.slug, activity.title))
  );

  return (
    <section className="activity-detail-page bg-frtp-mist">
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Activités", path: "/activites" },
            { name: activity.title, path: `/activites/${activity.slug}` }
          ]),
          serviceJsonLd(activity),
          ...(seoContent ? [faqJsonLd(seoContent.faq)] : [])
        ]}
      />
      <div className="dark-panel px-4 pb-12 pt-12 text-white md:px-6 md:pb-16 md:pt-18">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_0.78fr] md:items-end">
          <div>
            <Link href="/activites" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-300 transition hover:text-white">
              <ArrowLeft size={16} />
              Toutes les activités
            </Link>
            <div className="mt-8 inline-flex items-center gap-3">
              <span className="activity-detail-icon">
                <Icon size={30} />
              </span>
              <p className="border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.22em] text-blue-200 md:text-xs">
                Activité
              </p>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
              {seoContent?.heading ?? `${activity.title} à Fréjus et dans le Var`}
            </h1>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-zinc-300 md:text-xl">
              {activity.description}
            </p>
          </div>

          <aside className="activity-detail-hero-card">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-frtp-orange">Prestations principales</p>
            <div className="mt-5 grid gap-3">
              {activity.services.map((service) => (
                <p key={service} className="flex items-start gap-3 text-sm font-bold leading-6 text-zinc-100">
                  <CheckCircle2 size={18} className="text-frtp-orange" />
                  {service}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          {seoContent ? (
            <div className="mb-12 grid gap-8 border-b border-zinc-300 pb-12 md:mb-16 md:grid-cols-[0.9fr_1.1fr] md:pb-16">
              <div>
                <p className="border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-blue">Sur le terrain</p>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-zinc-950 md:text-5xl">
                  {seoContent.heading}
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-zinc-700">{seoContent.introduction}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 bg-frtp-orange px-5 py-3 text-sm font-black text-white">
                    Demander un devis <ArrowRight size={17} />
                  </Link>
                  <Link href="/zones-intervention" className="inline-flex min-h-12 items-center gap-2 px-1 font-black text-frtp-blue">
                    Voir la zone d'intervention <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
              <div className="grid content-start gap-3 sm:grid-cols-2">
                {seoContent.useCases.map((item) => (
                  <p key={item} className="flex min-h-16 items-start gap-3 border border-zinc-300 bg-white p-4 text-sm font-bold leading-6 text-zinc-800">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-frtp-orange" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <SectionHeading eyebrow="Chantiers associés" title="Quelques références proches de cette activité." />
            <div className="activity-detail-related-grid mt-8 md:mt-10">
            {related.length ? (
              related.map((project) => (
                <Link key={project.slug} href={`/realisations/${project.slug}`} className="activity-detail-project group">
                  <span className="activity-detail-project-image">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="activity-detail-project-overlay" />
                    <span className="activity-detail-project-category">{project.categories.join(" · ")}</span>
                  </span>
                  <span className="activity-detail-project-content">
                    <span className="activity-detail-project-meta">
                      <span><MapPin size={15} />{project.city}</span>
                      <span><CalendarDays size={15} />{project.date}</span>
                    </span>
                    <span className="activity-detail-project-title">{project.title}</span>
                    <span className="activity-detail-project-text">{project.short}</span>
                    <span className="activity-detail-project-link">Voir le chantier <ArrowRight size={17} /></span>
                  </span>
                </Link>
              ))
            ) : (
              <p className="activity-detail-empty">
                Aucun chantier n'est encore présenté pour cette activité. Découvrez nos autres réalisations ou contactez FRTP pour parler de votre projet.
              </p>
            )}
            </div>
          </div>

          {seoContent ? (
            <div className="mt-12 grid gap-10 border-t border-zinc-300 pt-12 md:mt-16 md:grid-cols-2 md:pt-16">
              <section>
                <p className="border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-blue">Déroulement</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-zinc-950">Un chantier préparé étape par étape</h2>
                <ol className="mt-7 grid gap-5">
                  {seoContent.process.map((step, index) => (
                    <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                      <b className="font-display text-xl text-frtp-orange">{String(index + 1).padStart(2, "0")}</b>
                      <div><h3 className="font-black text-zinc-950">{step.title}</h3><p className="mt-1 text-sm leading-7 text-zinc-600">{step.text}</p></div>
                    </li>
                  ))}
                </ol>
              </section>
              <section>
                <p className="border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-blue">Questions fréquentes</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-zinc-950">Préparer votre demande</h2>
                <div className="mt-7 grid gap-4">
                  {seoContent.faq.map((item) => (
                    <details key={item.question} className="border border-zinc-300 bg-white p-5">
                      <summary className="cursor-pointer font-black leading-6 text-zinc-950">{item.question}</summary>
                      <p className="mt-3 text-sm leading-7 text-zinc-600">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
