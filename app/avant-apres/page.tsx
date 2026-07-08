import type { Metadata } from "next";
import { BeforeAfterLightboxList } from "@/components/BeforeAfterLightboxList";
import { SectionHeading } from "@/components/SectionHeading";
import { getBeforeAfterItemsForSite, getStudioSettings } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Avant / Apres",
  description: "Comparez les photos de chantier FRTP avant et apres intervention : terrassement, VRD et amenagements exterieurs dans le Var et les Alpes-Maritimes."
};

export default async function BeforeAfterPage() {
  const [studio, pairs] = await Promise.all([getStudioSettings(), getBeforeAfterItemsForSite()]);

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Avant / Apres"
          title={studio.beforeAfterTitle}
          text={studio.beforeAfterText}
        />
        <BeforeAfterLightboxList pairs={pairs} />
      </div>
    </section>
  );
}
