import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { getActivitiesForSite, getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Activités",
  description: "Terrassement, VRD, assainissement, voirie, réseaux et aménagements extérieurs : les prestations de travaux publics FRTP dans le Var et les Alpes-Maritimes."
};

export default async function ActivitiesPage() {
  const [activities, studio] = await Promise.all([getActivitiesForSite(), getStudioSettings()]);

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nos activités"
          title={studio.activitiesPageTitle}
          text={studio.activitiesPageText}
        />
        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Link key={activity.slug} href={`/activites/${activity.slug}`} className="group border border-zinc-200 bg-white p-5 shadow-technical md:p-6">
                <Icon size={32} className="text-frtp-blue" />
                <h2 className="mt-4 text-xl font-black text-zinc-950 md:mt-5 md:text-2xl">{activity.title}</h2>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600 md:text-base">{activity.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {activity.services.slice(0, 3).map((service) => (
                    <span key={service} className="bg-frtp-gray px-3 py-1.5 text-xs font-bold text-zinc-700">
                      {service}
                    </span>
                  ))}
                </div>
                <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-black text-frtp-orange">
                  Voir le détail <ArrowRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
