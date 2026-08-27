import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { activities } from "@/lib/data";
import { SectionHeading } from "@/components/SectionHeading";
import { StructuredData } from "@/components/StructuredData";
import { getActivitiesForSite, getProjectsForSite } from "@/lib/server-data";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/structured-data";

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
  const related = projects.filter((project) => isProjectRelatedToActivity(project.category, activity.slug, activity.title));

  return (
    <section className="activity-detail-page bg-frtp-mist">
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Activités", path: "/activites" },
            { name: activity.title, path: `/activites/${activity.slug}` }
          ]),
          serviceJsonLd(activity)
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
              {activity.title}
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
          <div className="activity-detail-layout">
            <div className="activity-detail-copy">
              <SectionHeading eyebrow="Intervention" title="Une intervention cadrée, du repérage à la remise en état." text={activity.interventionExample} />
              <Link href="/contact" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white transition hover:bg-frtp-orangeDark active:translate-y-px sm:w-auto md:mt-8">
                Demander un devis <ArrowRight size={18} />
              </Link>
            </div>

            <div className="activity-detail-services">
              <p className="border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-blue">Travaux réalisés</p>
              <div className="mt-6 grid gap-0 sm:grid-cols-2">
                {activity.services.map((service) => (
                  <p key={service} className="activity-detail-service">
                    <CheckCircle2 size={17} />
                    {service}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
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
                    <span className="activity-detail-project-category">{project.category}</span>
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
        </div>
      </div>
    </section>
  );
}

function isProjectRelatedToActivity(projectCategory: string, activitySlug: string, activityTitle: string) {
  const category = normalize(projectCategory);
  const title = normalize(activityTitle);
  const slug = normalize(activitySlug);
  const aliases: Record<string, string[]> = {
    terrassement: ["terrassement"],
    vrd: ["vrd", "voiries reseaux divers"],
    assainissement: ["assainissement", "eaux usees", "eaux pluviales"],
    voirie: ["voirie"],
    reseaux: ["reseaux", "reseaux secs", "reseaux humides", "telecom", "electricite"],
    "amenagements-exterieurs": ["amenagements exterieurs", "amenagement", "abords"],
    "demolition-reprise": ["demolition", "reprise"]
  };

  return [slug, title, ...(aliases[activitySlug] ?? [])].some((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return category === normalizedCandidate || category.includes(normalizedCandidate);
  });
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
