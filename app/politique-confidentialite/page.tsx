import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { SectionHeading } from "@/components/SectionHeading";
import { getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description: "Politique de confidentialite et traitement des donnees personnelles du site FRTP."
};

export default async function PrivacyPage() {
  const studio = await getStudioSettings();

  return (
    <section className="invert-site bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Donnees" title={studio.privacyTitle} />
        <LegalDocument content={studio.privacyText} />
      </div>
    </section>
  );
}
