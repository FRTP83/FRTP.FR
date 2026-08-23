import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { getStudioSettings } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles du site FRTP.",
  path: "/politique-confidentialite"
});

export default async function PrivacyPage() {
  const studio = await getStudioSettings();

  return (
    <section className="legal-page bg-frtp-mist">
      <div className="dark-panel px-4 pb-12 pt-12 text-white md:px-6 md:pb-16 md:pt-18">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.22em] text-blue-200 md:text-xs">
            Données
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
            {studio.privacyTitle}
          </h1>
        </div>
      </div>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <LegalDocument content={studio.privacyText} />
        </div>
      </div>
    </section>
  );
}
