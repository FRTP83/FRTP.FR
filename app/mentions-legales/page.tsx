import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { SectionHeading } from "@/components/SectionHeading";
import { getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales du site FRTP : editeur, SIREN, RCS, TVA et hebergeur."
};

export default async function LegalPage() {
  const studio = await getStudioSettings();

  return (
    <section className="invert-site bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Legal" title={studio.legalTitle} />
        <LegalDocument content={studio.legalText} />
      </div>
    </section>
  );
}
