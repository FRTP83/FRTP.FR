import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActivitiesForSite, getProjectsForSite, getStudioSettings } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Terrassement, VRD et travaux publics dans le Var et les Alpes-Maritimes",
  description: "Terrassement, VRD, assainissement, voirie, réseaux et aménagements extérieurs : les prestations de travaux publics FRTP dans le Var et les Alpes-Maritimes.",
  path: "/activites"
});

export default async function ActivitiesPage() {
  const [activities, projects, studio] = await Promise.all([getActivitiesForSite(), getProjectsForSite(), getStudioSettings()]);

  return (
    <section className="activities-index-page bg-frtp-mist">
      <StructuredData data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Prestations et zones d’intervention", path: "/activites" }])} />
      <div className="dark-panel px-4 pb-14 pt-12 text-white md:px-6 md:pb-20 md:pt-18">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 md:text-xs md:tracking-[0.24em]">Prestations et zones d’intervention</p>
          <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
            {studio.activitiesPageTitle}
          </h1>
          <nav aria-label="Sections de la page" className="mt-7 flex flex-wrap gap-3 text-sm font-bold">
            <Link href="#prestations" className="border border-white/40 px-5 py-3 text-white">Nos prestations</Link>
            <Link href="#zones-intervention" className="border border-white/40 px-5 py-3 text-white">Nos zones d’intervention</Link>
          </nav>
        </div>
      </div>

      <section id="prestations" className="scroll-mt-28 px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-display text-3xl font-bold text-zinc-950 md:text-5xl">Nos prestations de travaux publics</h2>
          <div className="activities-index-grid">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <Link key={activity.slug} href={`/activites/${activity.slug}`} className="activities-index-card group">
                  <span className="activities-index-card-top">
                    <Icon size={30} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <span className="activities-index-services">
                    {activity.services.slice(0, 3).map((service) => (
                      <span key={service}>{service}</span>
                    ))}
                  </span>
                  <span className="activities-index-link">
                    Voir le détail <ArrowRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <ServiceAreaSection projects={projects} />
    </section>
  );
}
