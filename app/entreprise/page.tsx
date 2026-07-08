import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, HardHat, MapPinned, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Entreprise",
  description: "FRTP, société de travaux publics implantée à Fréjus : terrassement, VRD, assainissement, voirie et aménagements extérieurs dans le Var et les Alpes-Maritimes."
};

export default async function CompanyPage() {
  const studio = await getStudioSettings();

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="L'entreprise"
          title={studio.companyTitle}
          text={studio.companyIntro}
        />

        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-[1fr_1.05fr] md:items-start md:gap-8">
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
            <Image src={studio.companyImage} alt="Intervention FRTP" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="grid gap-5">
            {studio.companyCards.map(({ title, text }) => (
              <article key={title} className="border-l-4 border-frtp-blue bg-frtp-gray p-4 md:p-5">
                <h2 className="text-lg font-black text-zinc-950 md:text-xl">{title}</h2>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600 md:text-base">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 md:grid-cols-4 md:gap-4">
          {studio.companyPillars.map((label, index) => {
            const icons: LucideIcon[] = [HardHat, Truck, ShieldCheck, MapPinned];
            const Icon = icons[index] ?? HardHat;

            return (
            <div key={String(label)} className="border border-zinc-200 p-4 md:p-5">
              <Icon size={28} className="text-frtp-orange" />
              <p className="mt-4 font-black text-zinc-950">{label}</p>
            </div>
            );
          })}
        </div>

        <div className="mt-10 border border-zinc-200 p-4 md:mt-14 md:p-6">
          <h2 className="text-xl font-black text-zinc-950 md:text-2xl">Zones d'intervention</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {studio.serviceArea.map((area) => (
              <span key={area} className="inline-flex items-center gap-2 bg-frtp-gray px-3 py-2 text-sm font-bold text-zinc-700">
                <CheckCircle2 size={16} className="text-frtp-blue" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
