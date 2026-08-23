import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActivitiesForSite, getStudioSettings } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Activités",
  description: "Terrassement, VRD, assainissement, voirie, réseaux et aménagements extérieurs : les prestations de travaux publics FRTP dans le Var et les Alpes-Maritimes.",
  path: "/activites"
});

export default async function ActivitiesPage() {
  const [activities, studio] = await Promise.all([getActivitiesForSite(), getStudioSettings()]);

  return (
    <section className="activities-index-page bg-frtp-mist">
      <div className="dark-panel px-4 pb-14 pt-12 text-white md:px-6 md:pb-20 md:pt-18">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 md:text-xs md:tracking-[0.24em]">Nos activités</p>
          <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
            {studio.activitiesPageTitle}
          </h1>
          {studio.activitiesPageText ? (
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-zinc-300 md:text-xl">
              {studio.activitiesPageText}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="activities-index-grid">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <Link key={activity.slug} href={`/activites/${activity.slug}`} className="activities-index-card group">
                  <span className="activities-index-card-top">
                    <Icon size={30} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <h2>{activity.title}</h2>
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
      </div>
    </section>
  );
}
