import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, HardHat, MapPinned, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { getStudioSettings } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Entreprise",
  description: "FRTP, société de travaux publics implantée à Fréjus : terrassement, VRD, assainissement, voirie et aménagements extérieurs dans le Var et les Alpes-Maritimes.",
  path: "/entreprise"
});

export default async function CompanyPage() {
  const studio = await getStudioSettings();

  return (
    <section className="company-index-page bg-frtp-mist">
      <div className="dark-panel px-4 pb-14 pt-12 text-white md:px-6 md:pb-20 md:pt-18">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 md:text-xs md:tracking-[0.24em]">L'entreprise</p>
          <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
            {studio.companyTitle}
          </h1>
          {studio.companyIntro ? (
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-zinc-300 md:text-xl">
              {studio.companyIntro}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="company-index-layout">
            <div className="company-index-image">
              <Image src={studio.companyImage} alt="Intervention FRTP" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
            </div>
            <div className="company-index-cards">
              {studio.companyCards.map(({ title, text }) => (
                <article key={title} className="company-index-card">
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="company-index-pillars mt-10 md:mt-14">
            {studio.companyPillars.map((label, index) => {
              const icons: LucideIcon[] = [HardHat, Truck, ShieldCheck, MapPinned];
              const Icon = icons[index] ?? HardHat;

              return (
                <div key={String(label)} className="company-index-pillar">
                  <Icon size={28} />
                  <p>{label}</p>
                </div>
              );
            })}
          </div>

          <div className="company-index-area mt-10 md:mt-14">
            <p className="project-detail-eyebrow">Zone d'intervention</p>
            <h2>Un ancrage local, des interventions dans le Var et les Alpes-Maritimes.</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {studio.serviceArea.map((area) => (
                <span key={area}>
                  <CheckCircle2 size={16} />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
