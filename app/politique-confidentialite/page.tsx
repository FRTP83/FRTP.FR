import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { RichText } from "@/components/RichText";
import { getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles du site FRTP."
};

export default async function PrivacyPage() {
  const studio = await getStudioSettings();

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Données" title={studio.privacyTitle} />
        <RichText content={studio.privacyText} className="mt-6 md:mt-8" />
      </div>
    </section>
  );
}
