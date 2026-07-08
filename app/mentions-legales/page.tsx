import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { RichText } from "@/components/RichText";
import { getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site FRTP : éditeur, SIREN, RCS, TVA et hébergeur."
};

export default async function LegalPage() {
  const studio = await getStudioSettings();

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Legal" title={studio.legalTitle} />
        <RichText content={studio.legalText} className="mt-6 md:mt-8" />
      </div>
    </section>
  );
}
